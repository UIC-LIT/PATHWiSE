import { behaviors } from './behaviours.js';
import { credentials as GOOGLE_CREDENTIALS } from './google_creds.js';
let mistyWorker;
let conversationManager;
let recordingInProgress = false;
let isReadyToRecord = false;
let recordingFilename;
let currentCommentId;

class ConversationManager {
    constructor(mistyWorker, mistyIP) {
        // Core properties
        this.mistyWorker = mistyWorker;
        this.mistyIP = mistyIP;
        this.timeouts = [];
        this.isInitialSpeech = true;
        this.isServerReady = false;

        this.isProcessingSpeech = false;
        this.speechBuffer = [];
        this.lastProcessedText = "";

        this.confirmationPrompts = [
            "Would you like to add anything else?",
            "Do you have more thoughts to share?",
            "Is there something else you'd like to tell me?",
            "Should we continue with more of your ideas?",
            "Would you like to expand on that?",
            "Are there other points you'd like to discuss?",
            "Shall we add more to this discussion?",
            "Would you like to share additional thoughts?",
            "Is there anything else on your mind about this?",
            "Would you like to contribute more to this topic?"
        ];

        // Helper function to get random confirmation prompt
        this.getRandomConfirmationPrompt = () => {
            return this.confirmationPrompts[Math.floor(Math.random() * this.confirmationPrompts.length)];
        };

        // Initialize audio configuration first
        this.audioConfig = {
            sampleRate: 16000,
            channels: 1,
            chunkSize: 4096,
            bytesPerSample: 2
        };

        // State management
        this.states = {
            IDLE: 'idle',
            SPEAKING: 'speaking',
            TRANSITIONING: 'transitioning',
            LISTENING: 'listening',
            CONFIRMING: 'confirming',
            PROCESSING: 'processing',
            PAUSED: 'paused'
        };
        this.currentState = this.states.IDLE;

        // WebSocket connection
        this.ws = null;
        this.setupWebSocket();

        // Status flags
        this.isMistySpeaking = false;
        this.isRecording = false;
        this.isCalibrating = false;
        this.isCalibrated = false;
        this.shouldIgnoreNextSilence = false;

        // Audio properties 
        this.mediaStream = null;
        this.audioContext = null;
        this.lastTranscript = "";
        this.recordingStartTime = null;
        this.currentCommentId = null;

        // Recording chunks
        this.recordedChunks = [];

        // Timing controls
        this.speakingEndTime = null;
        this.noResponseTimeout = null;
        this.noResponseDuration = 10000; // 10 seconds
        this.pausedResponseDuration = 60000; // 1 minute
        this.minSilenceThreshold = 1000; // 1 second
        this.transitionDelay = 500; // 0.5 seconds

        // Resume keywords for pause state
        this.resumeKeywords = ['continue', 'ready', 'resume', 'back', 'start', 'go'];
        this.pauseCheckInterval = null;

        // Initialize audio after all configurations are set
        this.initializeAudio();
    }

    async initializeAudio() {
        try {
            // console.log('Initializing audio with config:', this.audioConfig);
            // Request microphone access immediately
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: this.audioConfig.channels,
                    sampleRate: { ideal: this.audioConfig.sampleRate },
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Store the stream for later use
            this.mediaStream = stream;

            // If WebSocket is connected, start calibration
            if (this.ws.readyState === WebSocket.OPEN) {
                await this.calibrateAudio();
            } else {
                // If WebSocket isn't connected yet, wait for connection
                this.pendingCalibration = true;
            }
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    }

    setupWebSocket() {
        // console.log('Setting up WebSocket connection...');
        this.ws = new WebSocket('wss://localhost:8765');

        this.ws.onopen = async () => {
            console.log('NLP_Server Websocket connected');
            // Start calibration immediately after connection
            if (!this.isCalibrated) {
                await this.calibrateAudio();
            }
        };

        this.ws.onmessage = async (event) => {
            const response = JSON.parse(event.data);

            // Only process messages if we're in the correct state
            if (this.currentState !== this.states.LISTENING &&
                response.type !== 'calibration_complete' &&
                response.type !== 'calibration_start') {
                // console.log('Ignoring message in non-listening state:', this.currentState);
                return;
            }

            await this.handleServerResponse(response);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('NLP_Server closed, reconnecting...');
            setTimeout(() => this.setupWebSocket(), 5000);
        };
    }

    async calibrateAudio() {
        try {
            console.log('Starting audio calibration...');
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: this.audioConfig.channels,
                    sampleRate: { ideal: this.audioConfig.sampleRate },
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            const context = new AudioContext({
                sampleRate: this.audioConfig.sampleRate,
                latencyHint: 'interactive'
            });

            const source = context.createMediaStreamSource(stream);
            const processor = context.createScriptProcessor(
                this.audioConfig.chunkSize,
                this.audioConfig.channels,
                this.audioConfig.channels
            );

            return new Promise((resolve) => {
                const calibrationDuration = 3000; // 3 seconds
                const startTime = Date.now();

                processor.onaudioprocess = (e) => {
                    const inputData = e.inputBuffer.getChannelData(0);
                    const audioData = this.convertFloat32ToInt16(inputData);

                    // Important change: Use 'calibration_audio' type for initial calibration
                    if (this.ws.readyState === WebSocket.OPEN) {
                        const buffer = new ArrayBuffer(audioData.length * 2);
                        const view = new DataView(buffer);

                        audioData.forEach((sample, index) => {
                            view.setInt16(index * 2, sample, true);
                        });

                        const base64data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                        this.ws.send(JSON.stringify({
                            type: 'audio_data', // Changed from 'calibration_audio' to match server expectations
                            audio: base64data
                        }));
                    }

                    if (Date.now() - startTime >= calibrationDuration) {
                        stream.getTracks().forEach(track => track.stop());
                        processor.disconnect();
                        source.disconnect();
                        context.close();
                        resolve();
                    }
                };

                source.connect(processor);
                processor.connect(context.destination);
            });

        } catch (error) {
            console.error('Error during calibration:', error);
        }
    }


    async beginConversation(commentId, text, emotion) {
        // console.log('Beginning conversation:', { commentId, text, emotion });
        this.currentCommentId = commentId;
        this.isInitialSpeech = true; // Reset for new conversation
        await this.setState(this.states.SPEAKING);
        await this.speak(text, emotion);
    }

    async executeStateChange(newState, oldState) {
        if (!this.mistyWorker) return;

        // Only blink for major state changes
        if (oldState !== newState &&
            !(newState === this.states.TRANSITIONING || oldState === this.states.TRANSITIONING)) {
            await this.mistyWorker.postMessage({
                payload: {
                    endpoint: this.mistyIP,
                    type: 'BEHAVIOR',
                    activity: 'blink'
                }
            });
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Special handling for SPEAKING state - use emotion behavior
        if (newState === this.states.SPEAKING) {
            return; // Don't execute state behavior, emotion behavior will be handled by speak()
        }

        // Execute state-specific behavior for other states
        await this.mistyWorker.postMessage({
            payload: {
                endpoint: this.mistyIP,
                type: 'BEHAVIOR',
                activity: newState.toLowerCase()
            }
        });
    }

    startNoResponseTimer() {
        this.clearNoResponseTimer();
        const duration = this.currentState === this.states.PAUSED ?
            this.pausedResponseDuration : this.noResponseDuration;

        this.noResponseTimeout = setTimeout(() => {
            this.handleNoResponse();
        }, duration);
        this.timeouts.push(this.noResponseTimeout);
    }

    async setState(newState) {
        const oldState = this.currentState;
        // console.log(`State transition: ${oldState} -> ${newState}`);
        this.currentState = newState;
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'state_change',
                state: newState
            }));
        }

        if (newState !== this.states.LISTENING) {
            this.isProcessingSpeech = false;
            this.speechBuffer = [];
            this.lastProcessedText = "";
        }

        try {
            switch (newState) {

                case this.states.SPEAKING:
                    await this.stopListening();
                    this.shouldIgnoreNextSilence = true;
                    this.isProcessingSpeech = false;
                    break;

                case this.states.LISTENING:
                    this.shouldIgnoreNextSilence = false;
                    this.isProcessingSpeech = false;

                    await this.executeStateChange(newState, oldState);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    if (oldState === this.states.PROCESSING) {
                        await new Promise(resolve => setTimeout(resolve, 750));
                    }
                    await this.startListening();
                    break;

                case this.states.TRANSITIONING:
                    if (this.isRecording) {
                        await this.stopListening();
                    }
                    this.shouldIgnoreNextSilence = true;
                    await this.executeStateChange(newState, oldState);
                    break;

                case this.states.PAUSED:
                    await this.stopListening();
                    this.clearAllTimeouts();
                    await this.executeStateChange(newState, oldState);
                    await this.startListening(); // Keep listening for resume keywords
                    break;

                case this.states.IDLE:
                    await this.stopListening();
                    this.clearAllTimeouts();
                    await this.executeStateChange(newState, oldState);
                    break;
            }
        } catch (error) {
            console.error('Error during state transition:', error);
            this.resetState();
            if (this.mistyWorker) {
                await this.mistyWorker.postMessage({
                    payload: {
                        endpoint: this.mistyIP,
                        type: 'BEHAVIOR',
                        activity: 'idle'
                    }
                });
            }
        }
    }

    async startListening() {
        if (this.isRecording) return;

        try {
            console.log('Starting audio recording...');
            this.isRecording = true;
            this.recordedChunks = [];
            this.lastTranscript = "";
            this.shouldIgnoreNextSilence = false;

            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: { ideal: 16000 },
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            this.audioContext = new AudioContext({
                sampleRate: 16000,
                latencyHint: 'interactive'
            });

            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

            source.connect(processor);
            processor.connect(this.audioContext.destination);

            // Using the exact same processing code as the test interface
            processor.onaudioprocess = (e) => {
                if (!this.isRecording) return;

                const inputData = e.inputBuffer.getChannelData(0);
                const audioData = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                    audioData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                }

                if (this.ws.readyState === WebSocket.OPEN && !this.shouldIgnoreNextSilence) {
                    const buffer = new ArrayBuffer(audioData.length * 2);
                    const view = new DataView(buffer);
                    audioData.forEach((sample, index) => {
                        view.setInt16(index * 2, sample, true);
                    });

                    const base64data = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                    this.ws.send(JSON.stringify({
                        type: 'audio_data',
                        audio: base64data
                    }));
                }
            };

            this.recordingStartTime = Date.now();
            this.startNoResponseTimer();

        } catch (error) {
            console.error('Error starting recording:', error);
            this.isRecording = false;
        }
    }

    async stopListening() {
        if (!this.isRecording) return;

        // console.log('Stopping recording...');
        this.isRecording = false;
        this.clearNoResponseTimer();

        // Stop MediaRecorder and wait for chunks
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        if (this.audioContext) {
            await this.audioContext.close();
            this.audioContext = null;
        }

        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
        }

        this.mediaStream = null;
        this.mediaRecorder = null;
    }

    convertFloat32ToInt16(float32Array) {
        const int16Array = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16Array;
    }


    async handleResumeFromPause() {
        // First acknowledge the resume
        await this.speak("Great! Let's continue where we left off.", 'joy');

        // Short delay before continuing
        await new Promise(resolve => setTimeout(resolve, 500));

        // Ask the confirmation question again and set up for intent classification
        await this.setState(this.states.CONFIRMING);
        await this.speak("Would you like to add anything else?", 'speaking');
        await this.confirmAdditionalInput();
    }

    async handleServerResponse(response) {
        // console.log('Server response:', response);

        if (this.isMistySpeaking || this.shouldIgnoreNextSilence) {
            // console.log('Ignoring server response while Misty is speaking or in transition');
            return;
        }

        switch (response.type) {
            case 'calibration_start':
                this.isCalibrating = true;
                // console.log('Calibration started:', response.message);
                break;

            case 'calibration_complete':
                this.isCalibrating = false;
                this.isCalibrated = true;
                console.log('Calibration complete');
                break;

            case 'ready_to_listen':
                // console.log('NLP Server ready to listen');
                this.isServerReady = true;
                // Now actually show the listening state
                await this.executeStateChange(this.states.LISTENING, this.currentState);
                break;

            case 'speech_recognized':
                if (!this.isProcessingSpeech &&
                    this.currentState === this.states.LISTENING &&
                    response.result.text) {

                    const newText = response.result.text;

                    // Avoid processing duplicate or similar text
                    if (newText === this.lastProcessedText) {
                        // console.log('Ignoring duplicate text');
                        return;
                    }

                    this.isProcessingSpeech = true;
                    this.clearNoResponseTimer();
                    this.lastTranscript = newText;
                    this.lastProcessedText = newText;
                    // console.log('Processing new speech:', this.lastTranscript);
                    this.startNoResponseTimer();
                    this.isProcessingSpeech = false;
                }
                break;

            case 'silence_detected':
                console.log('Silence detected');

                if (this.currentState === this.states.LISTENING &&
                    !this.shouldIgnoreNextSilence &&
                    !this.isProcessingSpeech &&
                    this.lastTranscript) {

                    await this.setState(this.states.CONFIRMING);
                    await this.speak(this.getRandomConfirmationPrompt(), 'speaking');
                    await this.confirmAdditionalInput();
                }
                break;

            case 'intent_classification':
                if (!response.intent) {
                    console.error('No intent provided in response');
                    return;
                }

                // Reset silence detection state before processing intent
                this.shouldIgnoreNextSilence = false;
                this.isProcessingSpeech = false;

                // Don't process intents if we're in PAUSED state
                if (this.currentState === this.states.PAUSED) {
                    return;
                }

                await this.handleIntentClassification(response.intent);
                break;
        }
    }

    async handleIntentClassification(intent) {
        // console.log('Handling intent:', intent);

        try {
            // Normalize intent to lowercase for consistent matching
            const normalizedIntent = intent.toLowerCase();

            switch (normalizedIntent) {
                case 'yes':
                case 'positive':
                    await this.speak("Great! Go ahead and tell me what else you'd like to add.", 'joy');
                    await this.setState(this.states.LISTENING);
                    break;

                case 'no':
                case 'negative':
                    await this.speak("Alright! That's great input. Let's move on to the next part!", 'anticipation');
                    await this.saveRecording();
                    await this.setState(this.states.IDLE);
                    break;

                case 'pause':
                    await this.speak("Okay, we'll take a break. Just let me know when you're ready to continue.", 'speaking');
                    this.clearAllTimeouts();
                    await this.setState(this.states.PAUSED);
                    break;

                case 'repeat':
                    const commentElement = document.querySelector(`.cp#${this.currentCommentId}`);
                    if (commentElement) {
                        const originalText = commentElement.getAttribute('data-comment');
                        // const originalEmotion = document.querySelector('#selected-emotion > p').textContent.trim().toLowerCase();

                        // First repeat the original comment
                        await this.speak(originalText, 'speaking');
                        await new Promise(resolve => setTimeout(resolve, 500));

                        // Then go back to confirmation flow
                        await this.setState(this.states.CONFIRMING);
                        await this.speak("Would you like to add anything else?", 'speaking');
                        await this.confirmAdditionalInput();
                    }
                    break;

                case 'uncertain':
                case 'unsure':
                    // Just speak the uncertainty prompt and return to listening
                    await this.setState(this.states.CONFIRMING);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await this.speak("I'm not sure about  what you said. Could you Repeat?", 'speaking');
                    await this.confirmAdditionalInput();

                    break;

                default:
                    // Modified default case to handle unclear responses better
                    await this.speak("I didn't catch that. Could you please repeat your response?", 'speaking');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await this.setState(this.states.LISTENING);
                    break;
            }
        } catch (error) {
            console.error('Error in intent classification:', error);
            await this.setState(this.states.IDLE);
        }
    }

    async confirmAdditionalInput() {
        this.startNoResponseTimer();
        this.shouldIgnoreNextSilence = false; // Reset silence detection

        const userResponse = await this.waitForUserResponse();
        this.clearNoResponseTimer();

        if (userResponse) {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'classify_intent',
                    text: userResponse
                }));
                this.lastTranscript = "";
                this.shouldIgnoreNextSilence = false; // Ensure silence detection is active
            }
        } else {
            await this.handleNoResponse();
        }
    }

    checkForResumeKeywords(transcript) {
        if (!transcript) return false;
        const words = transcript.toLowerCase().split(' ');
        return this.resumeKeywords.some(keyword => words.includes(keyword));
    }



    async confirmAdditionalInput() {
        this.startNoResponseTimer();
        const userResponse = await this.waitForUserResponse();
        this.clearNoResponseTimer();

        if (userResponse) {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'classify_intent',
                    text: userResponse
                }));
                this.lastTranscript = "";
            }
        } else {
            await this.handleNoResponse();
        }
    }

    async waitForUserResponse() {
        return new Promise((resolve) => {
            const checkTranscript = setInterval(() => {
                if (this.lastTranscript) {
                    clearInterval(checkTranscript);
                    resolve(this.lastTranscript);
                }
            }, 100);

            setTimeout(() => {
                    clearInterval(checkTranscript);
                    resolve(null);
                }, this.currentState === this.states.PAUSED ?
                this.pausedResponseDuration : this.noResponseDuration);
        });
    }

    startNoResponseTimer() {
        this.clearNoResponseTimer();
        const duration = this.currentState === this.states.PAUSED ?
            this.pausedResponseDuration : this.noResponseDuration;

        this.noResponseTimeout = setTimeout(() => {
            this.handleNoResponse();
        }, duration);
        this.timeouts.push(this.noResponseTimeout);
    }

    clearNoResponseTimer() {
        if (this.noResponseTimeout) {
            clearTimeout(this.noResponseTimeout);
            this.noResponseTimeout = null;
        }
    }

    async handleNoResponse() {
        // console.log('No response detected');
        if (this.currentState === this.states.PAUSED) {
            await this.speak("I'm still here if you need more time to think. Just let me know when you're ready.", 'speaking');
            this.startNoResponseTimer();
        } else {
            await this.speak("It seems like nobody's here. Let me know when you're ready to continue.", 'default');
            await this.setState(this.states.IDLE);
        }
    }




    async speak(text, emotion) {
        return new Promise((resolve) => {
            if (!this.mistyWorker) {
                resolve();
                return;
            }

            const handleSpeechComplete = async (event) => {
                if (event.data.type === 'AUDIO_COMPLETE') {
                    // console.log("Speech complete");
                    this.mistyWorker.removeEventListener('message', handleSpeechComplete);
                    this.isMistySpeaking = false;
                    this.speakingEndTime = Date.now();
                    this.shouldIgnoreNextSilence = true;
                    await this.setState(this.states.TRANSITIONING);

                    setTimeout(async () => {
                        this.shouldIgnoreNextSilence = false;
                        if (this.currentState !== this.states.IDLE &&
                            this.currentState !== this.states.PAUSED) {
                            await this.setState(this.states.LISTENING);
                        }
                        resolve();
                    }, 300);
                }
            };

            this.mistyWorker.addEventListener('message', handleSpeechComplete);
            this.setState(this.states.SPEAKING);
            this.isMistySpeaking = true;
            this.shouldIgnoreNextSilence = true;

            // Determine which behavior to use
            const behaviorToUse = this.isInitialSpeech ? emotion : 'speaking';
            // console.log(`Using behavior: ${behaviorToUse} (isInitial: ${this.isInitialSpeech})`);

            // Send single combined message
            this.mistyWorker.postMessage({
                payload: {
                    endpoint: this.mistyIP,
                    type: 'SPEAK_WITH_BEHAVIOR',
                    text: text,
                    emotion: emotion || 'default', // Keep for voice properties only
                    forceBehavior: behaviorToUse,
                    activity: 'speak'
                }
            });

            if (this.isInitialSpeech) {
                this.isInitialSpeech = false;
            }
        });
    }

    async saveRecording() {
        if (this.recordedChunks.length === 0) return;

        // console.log('Saving recording...');

        // Calculate total length and create merged array
        const totalSamples = this.recordedChunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const mergedData = new Float32Array(totalSamples);

        let offset = 0;
        for (const chunk of this.recordedChunks) {
            mergedData.set(chunk, offset);
            offset += chunk.length;
        }

        // Create WAV file
        const wavBlob = this.createWavBlob(mergedData);
        const fileName = `recording_${this.currentCommentId}_${Date.now()}.wav`;

        // Save file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(wavBlob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.recordedChunks = [];
    }

    createWavBlob(audioData) {
        const buffer = new ArrayBuffer(44 + audioData.length * 2);
        const view = new DataView(buffer);
        const sampleRate = this.audioConfig.sampleRate;

        // Write WAV header
        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + audioData.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, audioData.length * 2, true);

        // Write audio data
        const volume = 1;
        let offset = 44;
        for (let i = 0; i < audioData.length; i++) {
            view.setInt16(offset, audioData[i] * 0x7FFF * volume, true);
            offset += 2;
        }

        return new Blob([buffer], { type: 'audio/wav' });
    }

    getEmotionForState(emotion) {
        const emotions = {
            [this.states.SPEAKING]: emotion || 'interest',
            [this.states.TRANSITIONING]: 'anticipation',
            [this.states.LISTENING]: 'anticipation',
            [this.states.CONFIRMING]: 'speaking',
            [this.states.PROCESSING]: 'anticipation',
            [this.states.IDLE]: 'default',
            [this.states.PAUSED]: 'speaking'
        };
        return emotions[this.currentState] || 'default';
    }


    clearAllTimeouts() {
        this.clearNoResponseTimer();
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
    }

    resetState() {
        this.stopListening();
        this.currentState = this.states.IDLE;
        this.isMistySpeaking = false;
        this.lastTranscript = "";
        this.isProcessingSpeech = false;
        this.speechBuffer = [];
        this.lastProcessedText = "";
        this.shouldIgnoreNextSilence = false;
        this.clearAllTimeouts();
    }

    async destroy() {
        await this.stopListening();
        if (this.ws) {
            this.ws.close();
        }
        this.mistyWorker = null;
        this.resetState();
    }

    logState() {
        console.log({
            currentState: this.currentState,
            isRecording: this.isRecording,
            isMistySpeaking: this.isMistySpeaking,
            isCalibrated: this.isCalibrated,
            shouldIgnoreNextSilence: this.shouldIgnoreNextSilence,
            lastTranscript: this.lastTranscript,
            currentCommentId: this.currentCommentId
        });
    }
}

(function($) {
    const misty_IP = '10.0.0.219';

    function initWorker() {
        console.log("Initializing worker...");
        try {
            const workerPath = "./nlp/mistyWorker.js";
            mistyWorker = new Worker(workerPath);

            mistyWorker.onerror = (error) => {
                console.error("Worker error:", error);
            };

            // Initial connection to Misty
            mistyWorker.postMessage({
                credentials: GOOGLE_CREDENTIALS,
                behaviorsData: behaviors,
                payload: {
                    endpoint: misty_IP,
                    type: 'CONNECT'
                }
            });

            mistyWorker.onmessage = handleWorkerMessage;

            // Initialize conversation manager
            window.conversationManager = new ConversationManager(mistyWorker, misty_IP);

        } catch (error) {
            console.error("Worker initialization failed:", error);
        }
    }

    function handleWorkerMessage(event) {
        const { success, data, type, audioFilename } = event.data;

        if (!success) {
            console.error("Worker message indicated failure:", event.data);
            return;
        }

        switch (type) {
            case 'AUDIO_COMPLETE':
                console.log("Audio complete received");
                if (window.recordingMode === 'laptop') {
                    return;
                }

                if (conversationManager &&
                    conversationManager.currentState === conversationManager.states.SPEAKING) {
                    console.log('Misty finished speaking, starting to listen...');
                    conversationManager.startListening();
                }
                break;

            case 'AUDIO_START':
                console.log(`Audio ${type} started`);
                break;

            case 'BEHAVIOR':
            case 'SPEAK':
                console.log(`${type} action completed`);
                break;

            case 'AUDIO_DELETED':
                console.log(`Successfully deleted audio file: ${audioFilename}`);
                break;

            case 'ERROR':
                console.error('Error from Misty Worker:', data);
                if (conversationManager) {
                    conversationManager.resetState();
                }
                break;

            default:
                console.log('Unhandled message type:', type);
                break;
        }
    }

    $(document).ready(function() {
        // Initialize the worker first
        initWorker();

        // Handle comment click events
        $(document).on('click', '.cp', function() {
            if (!window.conversationManager) {
                console.error('Conversation manager not initialized');
                return;
            }

            const commentId = $(this).attr('id').trim();
            const commentText = $(this).attr('data-comment').trim();
            const emotion = $('#selected-emotion > p').text().trim().toLowerCase();

            console.log('Starting conversation:', { commentId, commentText, emotion });

            window.conversationManager.beginConversation(commentId, commentText, emotion);
        });

        // Handle play button clicks
        // $(document).on('click', '#comment-input[data-play="1"] #play', function() {
        //     console.log('play button clicked');

        //     var text = $(this).parent().children('textarea').val().trim();
        //     var emotion = $('#selected-emotion > p').text().trim().toLowerCase();

        //     if (mistyWorker) {
        //         mistyWorker.postMessage({
        //             payload: {
        //                 endpoint: misty_IP,
        //                 type: 'SPEAK_WITH_BEHAVIOR',
        //                 text: text,
        //                 emotion: emotion,
        //                 activity: 'play'
        //             }
        //         });
        //     } else {
        //         console.error('Worker not initialized');
        //     }
        // });
    });

})(window.jQuery);