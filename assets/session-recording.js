var audioRecorders = new Map(); // Map to store recorder objects with IDs
var audioChunks = new Map(); // Map to store chunks for each ID
const today = new Date();
var sessionRecordingData = {
    'title': formatAudioFileName(localStorage.getItem("currentArticleTitle"))
    // will add the student usernames, password, related articles and deadlines here
    // for now reusing the teacher side login info for the demo purposes
};
sessionInit();
$(document).on("click", "#start-assignment", function() {
    $('#student-splash').addClass('hide');
    //startRecording(sessionRecordingData.title);
});

function sessionInit() {
    $.each(articleList, function(i, v) {
        $("#assignment-list").append(
            "<li" +
            ((today >= v.from && today <= v.to) ?
                ' class="active"' :
                "") +
            ' data-article="' +
            v.filename +
            '">' +
            v.title + '. <span>Due: ' + formatDate(v.to) + '</span>' +
            "</li>"
        );
    });
}

function formatDate(date) {
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // 12-hour clock
    });
}

function formatAudioFileName(articleTitle) {
    // Convert the string to lowercase and replace spaces or word breaks with dashes
    // This is for audio file naming convention
    const formatted = articleTitle
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, '-') // Replace spaces or word breaks with dashes
        .replace(/[^\w\-]/g, ''); // Optionally remove any non-alphanumeric characters (except dashes)

    return formatted;
}

function startRecording(id) {
    if (!id) {
        console.error("Error: Please provide a unique ID to start the recording.");
        return;
    }

    // Check if a recording with the same ID already exists
    if (audioRecorders.has(id)) {
        console.warn(`Warning: Recording with ID ${id} already exists. Stopping and saving it before starting a new one.`);
        stopRecording(id); // Stop and save the existing recording
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                audioChunks.set(id, blob); // Save blob to map for later use
                saveRecording(blob, id); // Save the recording as a file
                audioRecorders.delete(id); // Clean up map entry
                audioChunks.delete(id);
                console.log(`Recording ${id} saved and removed from active recorders`);
            };

            mediaRecorder.start();
            audioRecorders.set(id, mediaRecorder); // Add to map
            console.log(`Recording ${id} started`);
        })
        .catch(err => console.error('Error accessing microphone:', err));
}

function stopRecording(id) {
    if (audioRecorders.has(id)) {
        const recorder = audioRecorders.get(id);
        recorder.stop();
        console.log(`Recording ${id} stopped`);
    } else {
        console.error(`No active recording found with ID ${id}`);
    }
}

function saveRecording(blob, id) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${id}.webm`; // Filename includes recording ID
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
}

window.addEventListener('beforeunload', (event) => {
    audioRecorders.forEach((recorder, id) => {
        if (recorder.state === 'recording') {
            recorder.stop();
            console.log(`Recording ${id} stopped on unload`);
        }
    });

    // Prevent the immediate closing of the tab
    event.preventDefault();
    event.returnValue = '';
});