import asyncio
import websockets
import ssl
import json
from vosk import Model, KaldiRecognizer
import base64
import os
import numpy as np
import logging
import time
from collections import deque
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
import difflib

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class IntentClassifier:
    def __init__(self, model_path):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        
        # Initialize model architecture
        self.model = DistilBertForSequenceClassification.from_pretrained(
            'distilbert-base-uncased',
            num_labels=4,
            dropout=0.3
        )
        
        # Load trained weights
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model = self.model.to(self.device)
        self.model.eval()
        
        # Define label mapping
        self.label_map = {
            0: 'YES',
            1: 'NO',
            2: 'PAUSE',
            3: 'REPEAT'
        }
        
        # Parameters for confidence analysis
        self.absolute_threshold = 0.5    # Minimum confidence for direct classification
        self.relative_ratio = 1.8        # How many times larger should max prob be compared to second highest
        self.similarity_threshold = 0.15  # Maximum difference between probabilities to be considered "similar"

    def analyze_probabilities(self, probs):
        """
        Analyze probability distribution to determine if one class is clearly dominant
        
        Args:
            probs: List of probabilities for each class
            
        Returns:
            tuple: (should_classify, dominant_class_idx, confidence_score)
        """
        # Sort probabilities in descending order and get indices
        sorted_probs_with_idx = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)
        indices = [idx for idx, _ in sorted_probs_with_idx]
        sorted_probs = [prob for _, prob in sorted_probs_with_idx]
        
        max_prob = sorted_probs[0]
        second_max_prob = sorted_probs[1]
        
        # Case 1: Clear high confidence
        if max_prob >= self.absolute_threshold:
            return True, indices[0], max_prob
            
        # Case 2: Dominant probability relative to others
        if max_prob >= (second_max_prob * self.relative_ratio):
            return True, indices[0], max_prob
            
        # Case 3: Probabilities too similar
        prob_differences = [abs(max_prob - p) for p in sorted_probs[1:]]
        if all(diff < self.similarity_threshold for diff in prob_differences):
            return False, None, max_prob
            
        # Case 4: No clear decision
        return False, None, max_prob

    def classify_intent(self, text):
        try:
            # Preprocess - just lowercase and strip
            processed_text = text.lower().strip()
            
            # Tokenize input
            encoding = self.tokenizer.encode_plus(
                processed_text,
                add_special_tokens=True,
                max_length=64,
                return_token_type_ids=False,
                padding='max_length',
                truncation=True,
                return_attention_mask=True,
                return_tensors='pt'
            )
            
            input_ids = encoding['input_ids'].to(self.device)
            attention_mask = encoding['attention_mask'].to(self.device)
            
            # Get prediction
            with torch.no_grad():
                outputs = self.model(input_ids=input_ids, attention_mask=attention_mask)
                probs = torch.nn.functional.softmax(outputs.logits, dim=1)
                all_probs = probs[0].cpu().tolist()
            
            # Analyze probabilities
            should_classify, pred_class, max_confidence = self.analyze_probabilities(all_probs)
            
            # Determine intent
            if should_classify and pred_class is not None:
                intent = self.label_map[pred_class]
            else:
                intent = "UNSURE"
            
            # Log all probabilities for analysis
            probs_str = " | ".join([f"{self.label_map[i]}: {p:.4f}" for i, p in enumerate(all_probs)])
            logging.info(f"Text: {text} | Intent: {intent} | Max Confidence: {max_confidence:.4f} | All probs: {probs_str}")
            
            return intent.lower()
                
        except Exception as e:
            logging.error(f"Error in intent classification: {e}")
            return "uncertain"

# Load Vosk model
model_path = "vosk-model-small-en-us-0.15"
model_dir = f"{model_path}" # FIX THIS
vosk_model = Model(model_dir)

# Initialize intent classifier with model path
model_path = "best_model.pt" # FIX THIS 
intent_classifier = IntentClassifier(model_path)

# Audio processing parameters
CALIBRATION_DURATION = 3.0
CALIBRATION_MARGIN = 12
MIN_SILENCE_DURATION = 1.5
FRAME_DURATION = 0.025
BUFFER_SIZE = 30
MIN_AUDIO_SIZE = 2048
SILENCE_RMS_WINDOW = 12

def merge_text(previous_text, new_text):
    if not previous_text:
        return new_text
        
    matcher = difflib.SequenceMatcher(None, previous_text, new_text)
    match = matcher.find_longest_match(0, len(previous_text), 0, len(new_text))
    
    if match.size > 0:
        merged = previous_text[:match.a] + new_text[match.b:]
        return ' '.join(merged.split())
    else:
        return f"{previous_text} {new_text}"

class AudioBuffer:
    def __init__(self, maxlen=BUFFER_SIZE):
        self.buffer = deque(maxlen=maxlen)
        self.current_size = 0
        self.last_speech_time = time.time()
        self.rms_values = deque(maxlen=SILENCE_RMS_WINDOW)
        self.silent_frames_count = 0
        self.background_db = None
        self.silence_threshold_db = None
        self.is_calibrated = False
        self.calibration_samples = []
        self.last_recognized_text = ""
        self.processing_lock = False
        self.text_buffer = []

    def is_processing(self):
        return self.processing_lock
        
    def start_processing(self):
        self.processing_lock = True
        
    def end_processing(self):
        self.processing_lock = False
        self.text_buffer = []

    def add(self, audio_data):
        self.buffer.append(audio_data)
        self.current_size += len(audio_data)
        
        audio_array = np.frombuffer(audio_data, dtype=np.int16)
        rms = np.sqrt(np.mean(np.square(audio_array.astype(float))))
        self.rms_values.append(rms)
        
        if not self.is_calibrated:
            self.calibration_samples.append(rms)

    def calibrate(self):
        if len(self.calibration_samples) < 10:
            return False
            
        background_rms = np.mean(self.calibration_samples)
        self.background_db = 20 * np.log10(max(background_rms, 1e-10))
        self.silence_threshold_db = self.background_db + CALIBRATION_MARGIN
        
        logging.info(f"Background noise level: {self.background_db:.2f} dB")
        logging.info(f"Silence threshold set to: {self.silence_threshold_db:.2f} dB")
        
        self.is_calibrated = True
        self.calibration_samples = []
        return True

    def is_silent(self):
        if not self.is_calibrated or not self.rms_values:
            return False
            
        recent_rms = np.median(self.rms_values)
        current_db = 20 * np.log10(max(recent_rms, 1e-10))
        return current_db < self.silence_threshold_db

    def get_and_clear(self):
        if self.current_size < MIN_AUDIO_SIZE:
            return None
            
        combined = np.concatenate([np.frombuffer(chunk, dtype=np.int16)
                                 for chunk in self.buffer])
        self.buffer.clear()
        self.current_size = 0
        return combined.tobytes()

async def nlp_server(websocket):
    logging.info("Client connected")
    
    audio_buffer = AudioBuffer()
    last_transcript = ""
    silence_start_time = None
    is_speaking = False
    speech_detected = False
    calibration_start_time = None
    local_recognizer = KaldiRecognizer(vosk_model, 16000)

    await websocket.send(json.dumps({
        'type': 'calibration_start',
        'message': 'Please remain silent for background noise calibration...'
    }))
    calibration_start_time = time.time()

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                
                if data['type'] == 'classify_intent':
                    intent = intent_classifier.classify_intent(data['text'])
                    await websocket.send(json.dumps({
                        'type': 'intent_classification',
                        'intent': intent
                    }))
                    continue
                    
                if data['type'] == 'audio_data':
                    if audio_buffer.is_processing():
                        continue  # Skip processing if we're already handling speech
                        
                    audio_bytes = base64.b64decode(data['audio'])
                    current_time = time.time()

                    # Handle calibration phase
                    if not audio_buffer.is_calibrated:
                        audio_buffer.add(audio_bytes)
                        if time.time() - calibration_start_time >= CALIBRATION_DURATION:
                            if audio_buffer.calibrate():
                                await websocket.send(json.dumps({
                                    'type': 'calibration_complete',
                                    'background_db': audio_buffer.background_db,
                                    'threshold_db': audio_buffer.silence_threshold_db
                                }))
                                await websocket.send(json.dumps({
                                    'type': 'ready_to_listen'
                                }))
                        continue

                    audio_buffer.add(audio_bytes)
                    is_silent = audio_buffer.is_silent()

                    # Process audio when we have enough data
                    combined_audio = audio_buffer.get_and_clear()
                    if combined_audio and not audio_buffer.is_processing():
                        if local_recognizer.AcceptWaveform(combined_audio):
                            audio_buffer.start_processing()
                            
                            result = json.loads(local_recognizer.Result())
                            if result.get('text'):
                                current_text = result['text']
                                if current_text != audio_buffer.last_recognized_text:
                                    logging.info(f"Recognized: {current_text}")
                                    await websocket.send(json.dumps({
                                        'type': 'speech_recognized',
                                        'result': {'text': current_text}
                                    }))
                                    audio_buffer.last_recognized_text = current_text
                                    audio_buffer.last_speech_time = current_time
                                    is_speaking = True
                                    speech_detected = True
                                    silence_start_time = None
                            
                            audio_buffer.end_processing()

                    # Handle non-silent audio
                    if not is_silent:
                        if not speech_detected:
                            logging.info("Speech detected")
                            speech_detected = True
                            silence_start_time = None
                            audio_buffer.last_speech_time = current_time

                    # Handle silence detection with better state management
                    if is_silent and is_speaking and not audio_buffer.is_processing():
                        if silence_start_time is None:
                            silence_start_time = current_time
                        
                        silence_duration = current_time - silence_start_time
                        if silence_duration >= MIN_SILENCE_DURATION:
                            audio_buffer.start_processing()
                            
                            # Get final result before resetting
                            final_result = local_recognizer.FinalResult()
                            if final_result:
                                final_data = json.loads(final_result)
                                if final_data.get('text'):
                                    await websocket.send(json.dumps({
                                        'type': 'speech_recognized',
                                        'result': {'text': final_data['text']}
                                    }))

                            # Send silence detection event
                            logging.info(f"Silence detected after {silence_duration:.2f} seconds")
                            await websocket.send(json.dumps({
                                'type': 'silence_detected',
                                'duration': silence_duration
                            }))

                            # Reset state
                            speech_detected = False
                            is_speaking = False
                            local_recognizer = KaldiRecognizer(vosk_model, 16000)
                            last_transcript = ""
                            silence_start_time = None
                            audio_buffer.last_recognized_text = ""
                            
                            audio_buffer.end_processing()

            except Exception as e:
                logging.error(f"Error processing message: {e}")
                audio_buffer.end_processing()  # Ensure we release the lock on error
                continue

    except websockets.exceptions.ConnectionClosed:
        logging.info("Client disconnected")
        if audio_buffer:
            audio_buffer.end_processing()
    except Exception as e:
        logging.error(f"Connection error: {e}")
        if audio_buffer:
            audio_buffer.end_processing()

if __name__ == "__main__":
    async def main():
        # Load SSL certificates
        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ssl_context.load_cert_chain(certfile="cert.crt", keyfile="key.pem")

        # Create WSS server with SSL
        server = await websockets.serve(nlp_server, "localhost", 8765, ssl=ssl_context)
        print("NLP Server starting on wss://localhost:8765")
        
        try:
            # Keep the server running
            await asyncio.Future()  # run forever
        except KeyboardInterrupt:
            print("\nShutting down server...")
        finally:
            server.close()
            await server.wait_closed()

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutting down server...")
    except Exception as e:
        print(f"Error starting server: {e}")