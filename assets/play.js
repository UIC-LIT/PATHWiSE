(function($) {
    var mistyIP = !localStorage.getItem("mistyIP") ? "10.0.0.221" : localStorage.getItem("mistyIP");
    var computerIP = !localStorage.getItem("computerIP") ? "10.0.0.221" : localStorage.getItem("computerIP");
    console.log("Misty IP is currently set to: " + mistyIP + ", and the computer IP is set to : " + computerIP + ". You can update it here: " + window.location.origin + "/set-ip.htm if needed. Reload this page after you're done updating to confirm the updated IP in effect.");
    var recognitionInstance = null;
    var silenceTimer = null;

    const audioPlayers = [];

    var currentComment = "c1";
    var audioFlag = 0;

    var emotionsList = [
        "anger",
        "anticipation",
        "disgust",
        "fear",
        "joy",
        "sadness",
        "surprise",
        "trust",
        "neutral",
        "listening"
    ];

    var behaviors = {
        "spooked": "SL 500\nFI eyes_terror.jpg\nFL true\nAU teethChatter.mp3\nTL 0 0 0 170 0 255 breathe 1220\nMH 0 10 0 90\nMT -75 0 500\nMAS 90 100 90 100\nMH 0 5 -2 100\nSL 100\nMAS 80 100 80 100\nMH 0 5 2 100\nMH 0 5 -2 100\nMH 0 5 2 100\nMAS 90 100 90 100\nMH 0 5 -2 100\nSL 100\nMAS 80 100 80 100",
        "boredom": "SL 500\nFI eyes_boredom.jpg\nTL 0 0 0 47 0 255 breathe 3474\nMH -20 0 -5 100\nMAS 90 90 90 90",
        "sleepy": "SL 500\nnDIS Zzzzzz\nTL 0 0 0 0 255 145 breathe 4035\nMAS 90 90 90 90\nAU snoring.mp3\nn",
        "amazement": "SL 500\nFI eyes_amazement.jpg\nTL 0 0 0 255 102 0 breathe 485\nMH 0 -10 0 90\nSL 1000\nMAS -40 90 -40 90",
        "disgust": "SL 500\nFI eyes_disgust.jpg\nTL 0 0 0 255 0 179 breathe 1645\nMH 20 5 0 100\nMT -25 0 500",
        "ecstasy": "SL 500\nFI eyes_ecstasy_frame_1.jpg\nDFI eyes_ecstasy_frame_2.jpg 2500\nTL 0 0 0 255 179 0 breathe 748\nMH 0 -15 0 90\nMAS -80 100 -80 25",
        "fear": "SL 500\nFIB eyes_fear.jpg 250\nTL 0 0 0 166 0 255 breathe 1377\nMH 0 5 0 100\nSL 500\nMT -25 0 500",
        "distraction": "SL 500\nFI eyes_distraction.gif\nTL 0 0 0 255 81 0 breathe 491\nMH 0 -15 -20 95\nMAS 90 90 90 90\nSL 1750\nMH 10 -15 -15 100",
        "admiration": "SL 500\nFI eyes_admiration.jpg\nTL 0 0 0 255 242 0 breathe 1487\nMH 10 0 0 100",
        "rage": "SL 500\nFI eyes_rage.jpg\nTL 0 0 0 255 4 0 breathe 312\nMH 0 -10 0 100\nMAS -75 90 -75 90",
        "interest": "SL 500\nFI eyes_interest.jpg\nTL 0 0 0 255 179 0 breathe 1154\nMH -25 0 0 100\nSL 500\nMT 25 0 500\nMAS 90 90 90 90",
        "acceptance": "SL 500\nFI eyes_acceptance.jpg\nTL 0 0 0 51 255 0 breathe 2601\nMH 0 0 0 100\nMAS 90 90 90 90\nMH 0 10 0 100\nMH 0 0 0 100",
        "surprise": "SL 500\nFI eyes_surprise.png\nTL 0 0 0 255 132 0 breathe 747\nMH 0 -10 0 100\nMAS -90 100 -90 100\nMH 0 0 0 100",
        "joy": "SL 500\nFI eyes_joy.jpg\nTL 0 0 0 255 157 0 breathe 1123\nMH -20 -13 0 90\nMAS 55 90 55 90",
        "trust": "SL 500\nTL 0 0 0 47 255 0 breathe 2707\nMH -10 -7 0 90\nMT 25 0 500\nFI eyes_trust.jpg\nMAS 90 100 90 100",
        "loathing": "SL 500\nFI eyes_loathing.jpg\nTL 0 0 0 255 0 204 breathe 1383\nMH 0 0 0 90\nn",
        "anticipation": "SL 500\nTL 0 0 0 255 230 0 breathe 1702\nMH 0 -5 0 100\nMAS 55 100 55 100\nSL 500\nFI eyes_anticipation.png\nMT 25 0 500",
        "neutral": "SL 500\nFI eyes_default.jpg\nCL 255 255 255\nMH 0 0 0 100\nMAS 90 100 90 100",
        "annoyance": "SL 500\nFI eyes_annoyed.jpg\nTL 0 0 0 255 26 0 breathe 793\nMH 0 0 0 90\nMAS 90 90 90 90",
        "elicit": "SL 500\nFI eyes_anticipation.jpg\nCL 255 255 255\nMH -15 0 0 100\nMAS 100 100 100 100",
        "serenity": "SL 500\nMH -15 -5 0 90\nTL 0 0 0 0 255 145 breathe 4035\nFI eyes_serenity.jpg",
        "grief": "SL 500\nFI eyes_grief.jpg\nTL 0 0 0 8 0 255 breathe 3124\nMT -25 0 500\nMH 15 25 0 90\nMAS 90 90 90 90",
        "dancing": "SL 500\nFI eyes_ecstasy_frame_1.jpg\nMAS 90 90 -90 90\nMT 0 15\nDFI eyes_ecstasy_frame_2.jpg 2500\nMAS -90 90 90 90\nMT 0 -15\nTL 3 173 252 252 3 248 breathe 748\nMAS 90 90 -90 90\nMT 0 15s",
        "anger": "SL 500\nFI eyes_anger.jpg\nTL 0 0 0 255 17 0 breathe 896\nMH 0 -5 0 90\nMAS -10 90 5 90",
        "pensiveness": "SL 500\nFI eyes_pensiveness.jpg\nTL 0 0 0 34 0 255 breathe 3954\nMH 10 5 -10 100\nMAS 90 90 90 90",
        "vigilance": "SL 500\nFI eyes_vigilance.jpg\nTL 0 0 0 255 51 0 breathe 931\nMH -10 5 0 100\nMT 25 0 500\nMAS 60 90 60 90",
        "sadness": "SL 500\nFI eyes_sad.jpg\nTL 0 0 0 21 0 255 breathe 3310\nMH 0 7 0 90\nMAS 90 90 90 90",
        "apprehension": "SL 500\nFI eyes_apprehension.jpg\nTL 0 0 0 0 64 255 breathe 2387\nMAS 90 100 90 100\nMH 0 0 -2 100\nSL 100\nMAS 80 100 80 100\nMH 0 0 2 100\nMH 0 0 -2 100\nMAS 90 100 90 100\nSL 100\nMAS 80 100 80 100",
        "terror": "SL 500\nFI eyes_terror.jpg\nTL 0 0 0 170 0 255 breathe 1220\nMH 0 10 0 90\nMT -75 0 500\nMAS 90 100 90 100\nMH 0 5 -2 100\nSL 100\nMAS 80 100 80 100\nMH 0 5 2 100\nMH 0 5 -2 100\nMH 0 5 2 100\nMAS 90 100 90 100\nMH 0 5 -2 100\nSL 100\nMAS 80 100 80 100",
        "intro": "SL 500\nFI eyes_default.jpg\nCL 255 255 255\nMH 0 0 0 100\nMAS 90 100 90 100",
        "listening": "SL 500\nTL 0 0 0 255 230 0 breathe 1702\nMH 0 -5 0 100\nMAS 55 100 55 100\nSL 500\nFI listening.png\nMT 25 0 500",
    };

    const executeBehavior = async (behaviorName) => {
        const behaviorContent = behaviors[behaviorName] || behaviors.default;
        const instructions = behaviorContent.split('\n');
        console.log('Executing behavior:', instructions);
        for (const instruction of instructions) {
            const args = instruction.trim().split(' ');
            if (args.length < 2) continue;

            switch (args[0]) {
                case 'SL':
                    await new Promise(resolve => setTimeout(resolve, parseInt(args[1])));
                    break;
                case 'FI':
                    console.log('Displaying image:', args[1]);
                    await fetch(`http://${mistyIP}/api/images/display`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ FileName: args[1] })
                    });
                    break;
                case 'TL':
                    console.log('Transitioning LED:', args[1], args[2], args[3], args[4], args[5], args[6]);
                    await fetch(`http://${mistyIP}/api/led/transition`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            Red: parseInt(args[1]),
                            Green: parseInt(args[2]),
                            Blue: parseInt(args[3]),
                            Red2: parseInt(args[4]),
                            Green2: parseInt(args[5]),
                            Blue2: parseInt(args[6]),
                            TransitionType: args[7],
                            TimeMS: parseInt(args[8])
                        })
                    });
                    break;
                case 'MH':
                    console.log('Moving Head:', args[1], args[2], args[3], args[4]);
                    await fetch(`http://${mistyIP}/api/head`, {
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
                    await fetch(`http://${mistyIP}/api/arms/set`, {
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

    $(document).ready(function() {
        if ($('.student-computer-facing').length) {
            isRobotControl = false;
        }
        setTimeout(function() {
            if ($('.student-facing').length && $("#pins-data").text().trim().length) {
                recreateCanvas();
            }
            $.each(homeworks, function(i, v) {
                $("#assignment-list").append(
                    '<li' + ((v.title == getCurrentArticleByStudentId(localStorage.getItem("auth"))) ? ' class="active"' : '') + '>' + v.title + '</li>'
                );
            });
        }, 150);
        setTimeout(function() {
            try {
                if (localStorage.getItem("auth").includes("student")) {
                    var randomNumber = getRandomNumber();
                    if (isRobotControl) {
                        sendToRobot(preIntros[randomNumber].text, emotionsList["1"], preIntros[randomNumber].clip);
                    } else {
                        playInComputer(preIntros[randomNumber].text, "1", preIntros[randomNumber].clip);
                    }
                    if (isProduction) {
                        $('body').addClass('audio-playing');
                        delayUntilAudioDuration(window.location.origin + '/assets/audios/' + preIntros[randomNumber].clip + '.mp3', 1);
                    } else {
                        setTimeout(function() {
                            $('#start-assignment').removeClass('hide');
                        }, 1500);
                    }
                }
            } catch (error) {
                console.log("Pre Intro Error: ", error);
            }
        }, 500);
        $(document).on("click", "#start-assignment", function() {
            $('#student-splash').addClass('hide');
            setTimeout(function() {
                var randomNumber = getRandomNumber();
                if (isRobotControl) {
                    sendToRobot(intros[randomNumber].text, emotionsList["1"], intros[randomNumber].clip);
                } else {
                    playInComputer(intros[randomNumber].text, "1", intros[randomNumber].clip);
                }
                if (isProduction) {
                    $('body').addClass('audio-playing');
                    delayUntilAudioDuration(window.location.origin + '/assets/audios/' + intros[randomNumber].clip + '.mp3');
                }
            }, 500);
        });
        $(document).on("click", 'body:not(.audio-playing) .cp:not(.focused)', function() {
            $('#reading-status li:not(.done)').first().addClass('done');
        });
        $(document).on("click", 'body:not(.audio-playing) .cp', function(event) {
            if (event.originalEvent && event.originalEvent.isTrusted) {
                console.log("Click triggered by mouse/keyboard");
            } else {
                console.log("Click triggered programmatically");
            }
            stopSpeechRecognition();
            stopAudios();
            var $this = $(this);
            var clicked = $this.data('clicked'); // Check if the element was clicked recently
            // If already clicked within the last 150ms, ignore the second click
            if (clicked) {
                return;
            }
            // Set flag to prevent double click
            $this.data('clicked', true);
            setTimeout(function() {
                var id = $this.attr("id");
                currentComment = id;

                var text = $this.attr('data-comment');
                var clip = $this.attr('data-clip');
                var emotion = $this.attr('data-emotion');
                var behavior = emotionsList[emotion];
                if (id == lastCustomComment) {
                    var randomNumber = getRandomNumber();
                    text = outros[randomNumber].text;
                    clip = outros[randomNumber].clip;
                }

                if (isRobotControl) {
                    sendToRobot(text, behavior, clip);
                } else {
                    playInComputer(text, emotion, clip);
                }
                if (isProduction) {
                    $('body').addClass('audio-playing');
                    if (currentComment == lastCustomComment) {
                        delayUntilAudioDuration(window.location.origin + '/assets/audios/' + clip + '.mp3');
                    } else {
                        delayUntilAudioDuration(window.location.origin + '/assets/audios/' + clip + '.mp3', 2);
                    }
                }
                // Reset the clicked flag after the timeout
                $this.removeData('clicked');
            }, 150); // 150ms interval before allowing the next click
        });
    });

    function runPrompts() {
        var randomNumber = getRandomNumber();
        if (isRobotControl) {
            sendToRobot(prompts[randomNumber].text, emotionsList["1"], prompts[randomNumber].clip);
        } else {
            playInComputer(prompts[randomNumber].text, "1", prompts[randomNumber].clip);
        }
        console.log("Ran a prompt");
        if (isProduction) {
            $('body').addClass('audio-playing');
            delayUntilAudioDuration(window.location.origin + '/assets/audios/' + prompts[randomNumber].clip + '.mp3', 3);
        }
    }

    function recreateCanvas() {
        $("#pages div.cp").remove();
        try {
            var recreatePins = JSON.parse($("#pins-data").text().trim());
            totalCommentCount = recreatePins.length;
            console.log("Total Comment Count: ", recreatePins.length);
            $.each(recreatePins, function(i, v) {
                var pinId = Number(v.id.slice(1));
                var clip = isProduction ? v.clip : '';
                $("#pages").append(
                    `<div data-clip="` +
                    clip +
                    `" data-type="` +
                    v.type +
                    `" data-emotion="` +
                    v.emotion +
                    `" data-comment="` +
                    v.text +
                    `" id="c` +
                    pinId +
                    `" class="cp" draggable="false" style="top:` +
                    v.top +
                    `px; left:` +
                    v.left +
                    `px;"><p></p>
                </div>`
                );
                $("#reading-status").append('<li data-id="c' + pinId + '"></li>');
            });
        } catch (error) {
            console.log("No saved pins found for the slected article in the database", error);
        }
    }

    function sendToRobot(text, behavior, clip) {
        executeBehavior(behavior);
        //var audioBase = "https://" + computerIP + "/assets/audios/"; // still has bug: computer based server to serve the audios
        // var audioBase = "https://anistuhin.com/misty/"; // internet based server to serve the audios
        var audioBase = ""; // robot based file system to serve the audios
        console.log("Sent to misty to play: " + audioBase + clip + ".mp3");
        if (isProduction) {
            Promise.race([
                    fetch('http://' + mistyIP + '/api/audio/play', {
                        method: 'POST',
                        body: '{ "FileName": "' + audioBase + clip + '.mp3" }'
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
                ])
                .then(response => response.json())
                .then(jsonData => console.log(jsonData));
        } else {
            Promise.race([
                    fetch('http://' + mistyIP + '/api/tts/speak', {
                        method: 'POST',
                        body: '{ "text":"' + text + '","pitch":0,"speechRate":0.9,"voice":null,"flush":true,"utteranceId":null,"language":null }'
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
                ])
                .then(response => response.json())
                .then(jsonData => console.log(jsonData));
        }
    }

    function playInComputer(text, emotion, clip) {
        stopSpeechRecognition();
        stopAudios();
        $(document).find('#selected-emotion > ul li[data-id="' + emotion + '"]').click();
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[1];
        msg.voiceURI = "native";
        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1.4;
        msg.text = text;
        msg.lang = "en-US";
        if (isProduction) {
            playClip(window.location.origin + '/assets/audios/' + clip + '.mp3');
        } else {
            speechSynthesis.speak(msg);
        }
    }

    function playClip(audioSrc) {
        // Create a new audio element and play the given MP3 file
        const newAudio = new Audio(audioSrc);
        newAudio.play().catch(function(e) {
            console.warn('Autoplay might be blocked:', e);
            $('body').removeClass('audio-playing');
        });

        // Store reference for future control
        audioPlayers.push(newAudio);

        $(newAudio).on('ended', function() {
            $('body').removeClass('audio-playing');
        });
    }

    function stopAudios() {
        // Stop and clean up any previous playing audios
        audioPlayers.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        $('body').removeClass('audio-playing');
        console.log("Stopped/Cleared audios");
    }


    function getRandomNumber() {
        return Math.floor(Math.random() * 8) + 1; // returns a number between 1 to 8
    }

    // function classifyResponse(text) { // basic match
    //     const positiveReplies = ["yes", "yeah", "yup", "sure", "okay", "ok", "absolutely", "indeed", "of course", "yessir"];
    //     const negativeReplies = ["no", "nope", "nah", "never", "not at all", "no way", "move on", "move forward"];
    //     const repeatReplies = ["repeat", "again", "pardon", "what", "say that again", "come again", "can you", "didn't catch"];

    //     text = text.trim().toLowerCase();
    //     console.log('classification input text: ' , text)
    //     if (repeatReplies.some(word => text.includes(word))) return 2; // repeat
    //     if (positiveReplies.some(word => text.includes(word))) return 1; // positive
    //     if (negativeReplies.some(word => text.includes(word))) return 0; // negative

    //     return 3; // Default to positive
    // }

    function classifyResponse(text) { // score based strict match
        const positiveReplies = ["yes", "yeah", "yup", "sure", "okay", "ok", "absolutely", "indeed", "of course", "yessir"];
        const negativeReplies = ["no", "no thanks", "no thank you", "nope", "nah", "naah", "not really", "not at all", "move on", "move forward"];
        const repeatReplies = ["repeat", "again", "pardon", "what", "say that again", "come again", "didn't catch"];

        text = text.trim().toLowerCase();
        console.log('classification input text:', text);

        const categories = [negativeReplies, positiveReplies, repeatReplies];
        const scores = [0, 0, 0]; // index 0 = negative, 1 = positive, 2 = repeat

        for (let i = 0; i < categories.length; i++) {
            for (const phrase of categories[i]) {
                const pattern = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (pattern.test(text)) {
                    scores[i]++;
                }
            }
        }

        console.log('Match Scores → Negative:', scores[0], 'Positive:', scores[1], 'Repeat:', scores[2]);

        const maxScore = Math.max(...scores);
        if (maxScore === 0) {
            return 3; // return 3 if nothing matched
        }

        const maxIndices = scores.map((val, idx) => val === maxScore ? idx : -1).filter(idx => idx !== -1);

        // Tie breaker: repeat > positive > negative
        const priority = [2, 1, 0];
        for (const preferred of priority) {
            if (maxIndices.includes(preferred)) {
                return preferred;
            }
        }

        return 3; // fallback if something weird happens
    }



    function startSpeechRecognition() {
        return new Promise((resolve, reject) => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                reject('Web Speech API not supported.');
                return;
            }

            // Cleanup previous instance if any
            if (recognitionInstance) {
                recognitionInstance.abort();
                recognitionInstance = null;
            }

            const recognition = new SpeechRecognition();
            recognitionInstance = recognition;

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            const SILENCE_TIMEOUT = 2000; // 2 seconds
            let finalTranscript = '';

            recognition.onresult = function(event) {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Reset silence timer
                if (silenceTimer) clearTimeout(silenceTimer);
                silenceTimer = setTimeout(() => {
                    recognition.stop();
                }, SILENCE_TIMEOUT);
            };

            recognition.onend = function() {
                recognitionInstance = null;
                $('body').removeClass('audio-playing');
                resolve(finalTranscript.trim());
            };

            recognition.onerror = function(event) {
                recognitionInstance = null;
                $('body').removeClass('audio-playing');
                reject('Speech recognition error: ' + event.error);
            };
            $('body').addClass('audio-playing');
            if(isRobotControl) {
                executeBehavior(emotionsList["9"]);    
            } else {
                $(document).find('#selected-emotion > ul li[data-id="9"]').click();
            }
            recognition.start();
        });
    }

    function stopSpeechRecognition() { // call to stop all recognizers at any time
        if (silenceTimer) {
            clearTimeout(silenceTimer);
            silenceTimer = null;
        }
        if (recognitionInstance) {
            recognitionInstance.abort();
            recognitionInstance = null;
        }
        $('body').removeClass('audio-playing');
        console.log("Stopped/Cleared recognitions");
    }

    function getAudioDuration(audioSrc) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = audioSrc;

            // Ensure metadata is loaded so we can access duration
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration); // Duration in seconds
            });

            audio.addEventListener('error', () => {
                reject('Failed to load audio metadata.');
            });
        });
    }

    async function manageRecognitionResults() {
        const text = await startSpeechRecognition();
        const classification = classifyResponse(text);
        switch (classification) {
            case 2:
                $('.cp#' + currentComment).click();
                console.log('Repeat happend on first run');
                break;
            default:
                runPrompts();
                break;
        }
    }

    async function manageRecognitionResultsFromPrompts() {
        const text = await startSpeechRecognition();
        const classification = classifyResponse(text);
        switch (classification) {
            case 2:
                $('.cp#' + currentComment).click();
                break;
            case 0:
                stopSpeechRecognition();
                if (isRobotControl) {
                    sendToRobot(negativeIntent[0].text, emotionsList[negativeIntent[0].emotion], negativeIntent[0].clip);
                } else {
                    playInComputer(negativeIntent[0].text, negativeIntent[0].emotion, negativeIntent[0].clip);
                }
                break;
            case 1:
                if (isRobotControl) {
                    sendToRobot(positiveIntent[0].text, emotionsList[positiveIntent[0].emotion], positiveIntent[0].clip);
                } else {
                    playInComputer(positiveIntent[0].text, positiveIntent[0].emotion, positiveIntent[0].clip);
                }
                $('body').addClass('audio-playing');
                const duration = await getAudioDuration(window.location.origin + '/assets/audios/' + positiveIntent[0].clip + '.mp3');
                console.log('Audio Duration:', duration, ' ', positiveIntent[0].clip);
                // Delay the execution of the following actions by the audio duration in milliseconds
                setTimeout(() => {
                    $('body').removeClass('audio-playing');
                    manageRecognitionResultsFromPrompts();
                    // runPrompts();
                }, duration * 1000); // Multiply by 1000 to convert from seconds to milliseconds
                break;
            default:
                runPrompts();
                break;
        }
    }

    async function delayUntilAudioDuration(clip, flag = 0) { // 3 = promopts, 2 = pin comment,  1 = preIntros, 0 = intors/outros(default)
        try {
            const audioSrc = clip;

            // Await the duration of the audio
            const duration = await getAudioDuration(audioSrc);

            console.log('Audio Duration:', duration, ' ', audioSrc);

            // Delay the execution of the following actions by the audio duration in milliseconds
            setTimeout(() => {
                if (flag == 1) {
                    $('#start-assignment').removeClass('hide');
                }
                if ($("#reading-status > li.done").length == totalCommentCount) {
                    setTimeout(function() {
                        window.open('https://uic.ca1.qualtrics.com/jfe/form/SV_8nRwUWCMwRV2JEO', '_blank');
                    }, 1500);
                }
                if (flag == 2) {
                    try {
                        manageRecognitionResults();
                    } catch (err) {
                        console.log('Recog/Classi error: ', err);
                    }
                }
                if (flag == 3) {
                    try {
                        manageRecognitionResultsFromPrompts();
                    } catch (err) {
                        console.log('Recog/Classi error 2: ', err);
                    }
                }
                $('body').removeClass('audio-playing');
            }, duration * 1000); // Multiply by 1000 to convert from seconds to milliseconds
        } catch (error) {
            console.error(error);
        }
    }

})(window.jQuery);