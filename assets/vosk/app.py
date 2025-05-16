from flask import Flask, request, jsonify
from flask_cors import CORS
from vosk import Model, KaldiRecognizer
import wave
import json
import os
import tempfile
import traceback

app = Flask(__name__)
CORS(app)

# Load Vosk model
model_path = "model"
if not os.path.exists(model_path):
    raise Exception(f"Model not found at {model_path}")
model = Model(model_path)

@app.route("/transcribe", methods=["POST"])
def transcribe():
    print("Request.files:", request.files)
    print("Request.form:", request.form)

    if "audio" not in request.files:
        return jsonify({ "error": "No audio file uploaded" }), 400

    audio_file = request.files["audio"]

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as input_file:
        audio_file.save(input_file.name)
        input_path = input_file.name

    try:
        with wave.open(input_path, "rb") as wf:
            # Ensure it's a mono audio file at 16000 Hz sample rate
            if wf.getnchannels() != 1 or wf.getframerate() != 16000:
                return jsonify({ "error": "Audio must be mono and 16000 Hz" }), 400

            # Initialize recognizer
            rec = KaldiRecognizer(model, wf.getframerate())
            rec.SetWords(True)

            results = []
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    results.append(result.get("text", ""))

            final_result = json.loads(rec.FinalResult())
            results.append(final_result.get("text", ""))

            transcript = " ".join(results).strip()
            return jsonify({ "transcript": transcript })

    except Exception as e:
        error_message = str(e)
        print(f"Error during transcription: {error_message}")
        traceback.print_exc()
        return jsonify({ "error": f"Error processing audio: {error_message}" }), 500

    finally:
        # Ensure the file is removed after processing
        try:
            os.remove(input_path)
        except Exception as e:
            print(f"Error removing file {input_path}: {str(e)}")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001)
