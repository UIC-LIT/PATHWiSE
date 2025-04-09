(function($) {
    var mistyIP = !localStorage.getItem("mistyIP") ? "10.0.0.221" : localStorage.getItem("mistyIP");
    console.log("Misty IP is currently set to: " + mistyIP + ", you can update it here: " + window.location.origin + "/robot-ip.htm if needed. Reload this page after you're done updating to confirm the updated IP in effect.");
    var isRobotControl = true;
    var recognitionInstance = null;
    var silenceTimer = null;

    const audioPlayers = [];

    var currentComment = "c1";
    var audioFlag = 0; // 0 = pin comment(default),  2 = prompts, 1 = preIntros/intors/outros

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
    ];

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
                        sendToRobot(preIntros[randomNumber].text, "1");
                    } else {
                        playInComputer(preIntros[randomNumber].text, "1", preIntros[randomNumber].clip);
                    }
                    $('body').addClass('audio-playing');
                    delayUntilAudioDuration(window.location.origin + '/assets/audios/' + preIntros[randomNumber].clip + '.mp3', true);
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
                    sendToRobot(intros[randomNumber].text, "1");
                } else {
                    playInComputer(intros[randomNumber].text, "1", intros[randomNumber].clip);
                }
                $('body').addClass('audio-playing');
                delayUntilAudioDuration(window.location.origin + '/assets/audios/' + intros[randomNumber].clip + '.mp3');
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
                if (id == "c11") {
                    var randomNumber = getRandomNumber();
                    text = outros[randomNumber].text;
                    clip = outros[randomNumber].clip;
                }

                if (isRobotControl) {
                    sendToRobot(text, behavior, clip);
                } else {
                    playInComputer(text, emotion, clip);
                    if (isProduction) {
                        $('body').addClass('audio-playing');
                        delayUntilAudioDuration(window.location.origin + '/assets/audios/' + clip + '.mp3');
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
            sendToRobot(prompts[randomNumber].text, "1");
        } else {
            playInComputer(prompts[randomNumber].text, "1", prompts[randomNumber].clip, 2);
        }
    }

    function recreateCanvas() {
        $("#pages div.cp").remove();
        try {
            var recreatePins = JSON.parse($("#pins-data").text().trim());
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
        if (isProduction) {
            Promise.race([
                    fetch('http://' + mistyIP + '/api/audio/play', {
                        method: 'POST',
                        body: '{ "FileName":"' + window.location.origin + '/assets/audios/' + clip + '.mp3" }'
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
        return Math.floor(Math.random() * 9) + 1; // returns a number between 1 to 10
    }

    function classifyResponse(text) {
        const positiveReplies = ["yes", "yeah", "yup", "sure", "okay", "ok", "absolutely", "indeed", "of course", "yessir"];
        const negativeReplies = ["no", "nope", "nah", "never", "not at all", "no way"];
        const repeatReplies = ["repeat", "again", "pardon", "what", "say that again", "come again", "can you", "didn't catch"];

        text = text.trim().toLowerCase();

        if (repeatReplies.some(word => text.includes(word))) return 2; // repeat
        if (positiveReplies.some(word => text.includes(word))) return 1; // positive
        if (negativeReplies.some(word => text.includes(word))) return 0; // negative

        return 3; // Default to positive
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

            const SILENCE_TIMEOUT = 2500; // 2.5 seconds
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
                resolve(finalTranscript.trim());
            };

            recognition.onerror = function(event) {
                recognitionInstance = null;
                reject('Speech recognition error: ' + event.error);
            };

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

    async function delayUntilAudioDuration(clip, flag = false) {
        try {
            const audioSrc = clip;

            // Await the duration of the audio
            const duration = await getAudioDuration(audioSrc);
            console.log('Audio Duration:', duration);

            // Delay the execution of the following actions by the audio duration in milliseconds
            setTimeout(() => {
                $('body').removeClass('audio-playing');
                if (flag) {
                    $('#start-assignment').removeClass('hide');
                }
                if ($("#reading-status > li.done").length == 11) {
                    setTimeout(function() {
                        window.open('https://uic.ca1.qualtrics.com/jfe/form/SV_8nRwUWCMwRV2JEO', '_blank');
                    }, 1500);
                }
            }, duration * 1000); // Multiply by 1000 to convert from seconds to milliseconds
        } catch (error) {
            console.error(error);
        }
    }

})(window.jQuery);