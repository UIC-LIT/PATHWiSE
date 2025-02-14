/* eslint-disable no-restricted-globals */

// import { credentials as GOOGLE_CREDENTIALS } from "./google_creds.js";
// import { behaviors } from "./behaviours.js"


self.onerror = function(error) {
    console.error("Worker internal error:", error);
};
// console.log("Worker started");

let currentVolume = 10;
let behaviors = {};
let GOOGLE_CREDENTIALS = {};

const emotionToBehavior = {
    annoyed: 'annoyance',
    anticipation: 'anticipation',
    apprehension: 'apprehension',
    bored: 'boredom',
    dancing: 'dancing',
    disgust: 'disgust',
    distracted: 'distraction',
    ecstatic: 'ecstasy',
    elicit: 'elicit',
    fear: 'fear',
    grief: 'grief',
    interest: 'interest',
    joy: 'joy',
    loathing: 'loathing',
    pensive: 'pensiveness',
    rage: 'rage',
    sad: 'sadness',
    serene: 'serenity',
    sleepy: 'sleepy',
    spooked: 'spooked',
    surprised: 'surprise',
    terror: 'terror',
    trust: 'trust',
    vigilant: 'vigilance',
    default: 'default'
};

let socket;
let ipAddress;
let isSubscribedToAudioComplete = false;

const connectWebSocket = (ip) => {
    ipAddress = ip;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        socket = new WebSocket(`ws://${ip}/pubsub`);

        socket.onopen = () => {
            console.log('WebSocket connected');
            registerForAudioPlayComplete();
            registerForBumpSensor();
        };

        socket.onmessage = (event) => {
            // console.log('WebSocket message:', event.data);
            const data = JSON.parse(event.data);
            if (data.eventName === 'AudioPlayComplete') {
                if (data.message && data.message.metaData) {
                    // console.log('Audio playback completed');
                    self.postMessage({
                        success: true,
                        data: 'Audio playback completed',
                        type: 'AUDIO_COMPLETE',
                        audioFilename: data.message.metaData.name
                    });

                    if (data.message.metaData.name !== "mario_bros_coin.mp3") {
                        deleteAudio(data.message.metaData.name)
                    }

                } else {
                    console.log('AudioPlayComplete registration status received');
                }
            } else if (data.eventName === 'BumpSensor') {
                handleBumpSensorEvent(data);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
            isSubscribedToAudioComplete = false;
        };
    }
};

//Behaviour Mapping

const executeBehavior = async (behaviorName) => {
    const behaviorContent = behaviors[behaviorName] || behaviors.default;
    const instructions = behaviorContent.split('\n');
    // console.log('Executing behavior:', instructions);
    for (const instruction of instructions) {
        const args = instruction.trim().split(' ');
        if (args.length < 2) continue;

        switch (args[0]) {
            case 'SL':
                await new Promise(resolve => setTimeout(resolve, parseInt(args[1])));
                break;
            case 'FI':
                // console.log('Displaying image:', args[1]);
                await fetch(`http://${ipAddress}/api/images/display`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ FileName: args[1] })
                });
                break;
            case 'TL':
                // console.log('Transitioning LED:', args[1], args[2], args[3], args[4], args[5], args[6]);
                await fetch(`http://${ipAddress}/api/led`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        red: parseInt(args[1]),
                        green: parseInt(args[2]),
                        blue: parseInt(args[3]),
                        Red2: parseInt(args[4]),
                        Green2: parseInt(args[5]),
                        Blue2: parseInt(args[6]),
                        TransitionType: args[7],
                        TimeMS: parseInt(args[8])
                    })
                });
                break;
            case 'MH':
                // console.log('Moving Head:', args[1], args[2], args[3], args[4]);
                await fetch(`http://${ipAddress}/api/head`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Roll: parseInt(args[1]),
                        Pitch: parseInt(args[2]),
                        Yaw: parseInt(args[3]),
                        Velocity: parseInt(args[4])
                    })
                });
                break;
            case 'MAS':
                await fetch(`http://${ipAddress}/api/arms/set`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        LeftArmPosition: parseInt(args[1]),
                        LeftArmVelocity: parseInt(args[2]),
                        RightArmPosition: parseInt(args[3]),
                        RightArmVelocity: parseInt(args[4])
                    })
                });
                break;
        }
    }

    console.log('Behavior executed Successfullly:', behaviorName);
};


//Event Triggers
const registerForAudioPlayComplete = () => {
    const subscribeMsg = {
        Operation: 'subscribe',
        Type: 'AudioPlayComplete',
        DebounceMs: 0,
        EventName: 'AudioPlayComplete',
        ReturnProperty: null,
        EventConditions: []
    };
    socket.send(JSON.stringify(subscribeMsg));
};

const registerForBumpSensor = () => {
    const subscribeMsg = {
        Operation: 'subscribe',
        Type: 'BumpSensor',
        DebounceMs: 0,
        EventName: 'BumpSensor',
        ReturnProperty: null,
        EventConditions: []
    };
    socket.send(JSON.stringify(subscribeMsg));
};

const handleBumpSensorEvent = (data) => {
    if (data.message && data.message.isContacted) {
        const sensorId = data.message.sensorId;
        let bumpSensor;


        //the placement of the robot changes the bumper mapping
        switch (sensorId) {
            case 'bfl':
            case 'brl':
                bumpSensor = 'RightBumper';
                break;
            case 'bfr':
            case 'brr':
                bumpSensor = 'LeftBumper';
                break;
            default:
                // console.log('Unknown bump sensor:', sensorId);
                return;
        }

        self.postMessage({
            success: true,
            data: 'Bump sensor pressed',
            type: 'BUMP_SENSOR',
            sensor: bumpSensor
        });
    }
};

const performAction = async (action) => {
    try {
        const response = await fetch(`http://${ipAddress}/api/actions/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: action,
                useVisionData: false
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Network error when performing action: ${action}`, error);
        throw error;
    }
};

const uploadAudio = async (base64AudioData, filename) => {
    const uploadResponse = await fetch(`http://${ipAddress}/api/audio`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            FileName: filename,
            Data: base64AudioData,
            OverwriteExisting: true,
        })
    });

    // console.log("Upload Response from teh Upload audio function : ",uploadResponse);


    if (!uploadResponse.ok) {
        throw new Error(`Failed to upload audio: ${uploadResponse.statusText}`);
    }
};


const playAudio = async (filename) => {
    const playResponse = await fetch(`http://${ipAddress}/api/audio/play`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ AssetId: filename, volume: currentVolume })
    });

    if (!playResponse.ok) {
        throw new Error(`Failed to play audio: ${playResponse.statusText}`);
    }
};

const pauseAudio = async () => {
    try {
        const response = await fetch(`http://${ipAddress}/api/audio/pause`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Failed to pause audio: ${response.statusText}`);
        }

        // console.log('Audio paused successfully');
        return true;
    } catch (error) {
        console.error('Error pausing audio:', error);
        throw error;
    }
};


const stopAudio = async () => {
    try {
        const response = await fetch(`http://${ipAddress}/api/audio/stop`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`Failed to stop audio: ${response.statusText}`);
        }

        // console.log('Audio stopped successfully');
        return true;
    } catch (error) {
        console.error('Error stopping audio:', error);
        throw error;
    }
};

const deleteAudio = async (filename) => {
    try {
        const response = await fetch(`http://${ipAddress}/api/audio`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ FileName: filename })
        });

        if (!response.ok) {
            throw new Error(`Failed to delete audio: ${response.statusText}`);
        }

        const result = await response.json();
        // console.log("Successfully deleted file:",result,filename)
        return result.result;
    } catch (error) {
        console.error('Error deleting audio:', error);
        throw error;
    }
};


const getAccessToken = async () => {
    const jwtToken = await generateJWT();
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwtToken,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
};

const generateJWT = async () => {
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600; // Token expires in 1 hour

    const header = {
        alg: 'RS256',
        typ: 'JWT',
        kid: GOOGLE_CREDENTIALS.private_key_id
    }

    const claim = {
        iss: GOOGLE_CREDENTIALS.client_email,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        aud: 'https://oauth2.googleapis.com/token',
        exp: expiry,
        iat: now
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedClaim = btoa(JSON.stringify(claim));

    const signatureInput = `${encodedHeader}.${encodedClaim}`;
    const signature = await signJWT(signatureInput, GOOGLE_CREDENTIALS.private_key);

    return `${signatureInput}.${signature}`;
};

const signJWT = async (input, privateKey) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    privateKey = privateKey.replace(/\\n/g, '\n');

    const importedKey = await crypto.subtle.importKey(
        'pkcs8',
        str2ab(atob(privateKey.split('-----')[2].replace(/\s/g, ''))), {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256',
        },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        importedKey,
        data
    );

    return btoa(String.fromCharCode.apply(null, new Uint8Array(signature)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};

const textToSpeech = async (text) => {
    const accessToken = await getAccessToken();

    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            input: { text },
            voice: { languageCode: 'en-US', name: 'en-US-Neural2-F' },
            audioConfig: { audioEncoding: 'MP3', pitch: 0.6, speakingRate: 0.9 },
        }),
    });

    if (!response.ok) {
        throw new Error(`TTS API error! status: ${response.status}`);
    }

    const data = await response.json();
    return { audioContent: data.audioContent };
};

const uploadAndPlayAudio = async (text, activity, type) => {
    console.log(`Worker preparing to speak: ${activity}`);
    const { audioContent } = await textToSpeech(text);
    const timestamp = Date.now();
    const filename = `${activity}_${type}_${timestamp}.mp3`;

    try {
        await uploadAudio(audioContent, filename);
        await playAudio(filename);
        return filename;
    } catch (error) {
        console.error('Error in uploadAndPlayAudio:', error);
        throw error;
    }
};


// const uploadAndPlayAudio = async (ipAddress, base64AudioData, activity) => {
//   const timestamp = Date.now();
//   const filename = `${activity}_${timestamp}.mp3`;

//   const uploadResponse = await fetch(`http://${ipAddress}/api/audio`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       FileName: filename,
//       Data: base64AudioData,
//       ImmediatelyApply: true,
//     })
//   });

//   if (!uploadResponse.ok) {
//     throw new Error(`Failed to upload audio: ${uploadResponse.statusText}`);
//   }

//   const playResponse = await fetch(`http://${ipAddress}/api/audio/play`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ AssetId: filename })
//   });

//   if (!playResponse.ok) {
//     throw new Error(`Failed to play audio: ${playResponse.statusText}`);
//   }

//   return filename;
// };

self.onmessage = async function(e) {
    const { credentials, behaviorsData, payload } = e.data;
    // console.log("Data in the worker : ",e.data);

    // const { endpoint, payload } = e.data;
    if (credentials) GOOGLE_CREDENTIALS = credentials;
    if (behaviorsData) behaviors = behaviorsData;
    const { type, text, emotion, activity, volume, filename, endpoint, commentId } = payload; // Receiving commentId
    let currentCommentId = commentId;
    // console.log("Payload in the worker : ",payload);


    if (endpoint) {
        try {
            const url = new URL(endpoint);
            ipAddress = url.hostname;
        } catch (error) {
            console.error('Invalid endpoint URL:', endpoint);
            ipAddress = endpoint; // Fallback to using the endpoint as is
        }
    }

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        connectWebSocket(ipAddress);
    }

    // console.log(`Worker received message for ${JSON.stringify(payload)}`);

    try {
        let audioFilename;

        if (type === 'SET_VOLUME') {
            currentVolume = volume;
            // console.log(`Worker updated volume to: ${currentVolume}`);
            self.postMessage({
                success: true,
                type: 'VOLUME_UPDATED',
                data: { volume: currentVolume }
            });
            return;
        }

        if (type === 'PAUSE_AUDIO') {
            // console.log('Worker pausing audio');
            await pauseAudio();
            self.postMessage({ success: true, data: 'Audio paused', type: 'AUDIO_PAUSED' });
            return;
        }

        if (type === 'STOP_AUDIO') {
            // console.log('Worker stopping audio');
            await stopAudio();
            self.postMessage({ success: true, data: 'Audio stopped', type: 'AUDIO_STOPPED' });
            return;
        }

        if (emotion) {
            console.log(`Performing emotion behavior: ${emotion} for activity: ${activity}`);
            const behaviorName = emotion || 'default';
            await executeBehavior(behaviorName);
        }

        switch (type) {
            case 'DELETE_AUDIO':
                // console.log(`Worker deleting audio file: ${filename}`);
                const deleteResult = await deleteAudio(filename);
                if (deleteResult) {
                    // console.log(`Successfully deleted audio file: ${filename}`);
                    self.postMessage({ success: true, data: 'Audio file deleted', type: 'AUDIO_DELETED', filename });
                } else {
                    console.error(`Failed to delete audio file: ${filename}`);
                    self.postMessage({ success: false, error: 'Failed to delete audio file', type: 'AUDIO_DELETE_FAILED', filename });
                }
                break;

            case 'RECORD_AUDIO':
                audioFilename = `recording_studentID_${currentCommentId}.wav`;
                // console.log('Worker starting audio recording with filename:', audioFilename); 
                await fetch(`http://${ipAddress}/api/audio/record/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ FileName: audioFilename })
                });
                self.postMessage({ success: true, data: 'Recording started', type: 'RECORDING_STARTED', audioFilename: audioFilename });
                break;

            case 'STOP_RECORD_AUDIO':
                // console.log('Worker stopping audio recording');
                await fetch(`http://${ipAddress}/api/audio/record/stop`, { method: 'POST' });
                self.postMessage({ success: true, data: 'Recording stopped', type: 'RECORDING_STOPPED' });
                break;
            case 'READ_BOOK':
            case 'SPEAK':
            case 'SPEAK_INTERIM':
                audioFilename = await uploadAndPlayAudio(text, activity, type);
                break;
            case 'BEHAVIOR':
                // console.log(`Worker sending behavior command: ${activity}`);
                await executeBehavior(activity);
                break;
            case 'SPEAK_WITH_BEHAVIOR':
                try {
                    // console.log(`Worker executing speech with behavior: ${payload.forceBehavior}`);

                    // Only execute the forced behavior, ignore emotion behavior
                    await executeBehavior(payload.forceBehavior);

                    // Upload and play audio without re-executing behavior
                    const audioFilename = await uploadAndPlayAudio(payload.text, payload.activity, 'SPEAK');

                    // Send single completion message
                    self.postMessage({
                        success: true,
                        data: 'Action completed',
                        type: 'AUDIO_START',
                        audioFilename
                    });
                } catch (error) {
                    console.error('Error in SPEAK_WITH_BEHAVIOR:', error);
                    self.postMessage({ success: false, error: error.message });
                }
                break;

            case 'PAUSE':
                // console.log(`Worker pausing Misty`);
                await fetch(`http://${ipAddress}/api/audio/pause`, { method: 'POST' });
                break;
            case 'PAUSE_AUDIO':
                // console.log('Worker pausing audio');
                await pauseAudio();
                break;
            case 'PLAY_AUDIO':
                // console.log(`Worker playing audio file: ${filename}`);
                await playAudio(filename);
                self.postMessage({ success: true, data: 'Action completed', type, audioFilename: filename });
                break;
            case 'CONNECT':
                // console.log(`Worker connecting to Misty: ${ipAddress}`);
                await fetch(`http://${ipAddress}/api/battery`, { method: 'GET' });
                // await fetch(`http://localhost:8000/api/v1/activites/lol/misty`, { method: 'GET' });
                await executeBehavior('joy');
                // const connect_text = "Hi, I'm Misty. How can I help you today?";
                // audioFilename = await uploadAndPlayAudio(connect_text, 'hi', 'hi');
                break;
            case 'DISCONNECT':
                // console.log('Worker disconnecting from Misty');
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
                break;
            default:
                throw new Error('Unknown request type');
        }

        // console.log(`Worker completed ${type} action successfully with audio: ${audioFilename}`);
        self.postMessage({ success: true, data: 'Action completed', type, audioFilename });

    } catch (error) {
        console.error(`Worker encountered an error during ${type} action:`, error);
        self.postMessage({ success: false, error: error.message });
    }
};