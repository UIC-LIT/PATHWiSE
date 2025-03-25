<?php
session_start();

// === PASSWORD PROTECTION ===
$correct_password = "mypassword"; // Change this to your actual password
if (!isset($_SESSION['authenticated'])) {
    if (isset($_POST['password']) && $_POST['password'] === $correct_password) {
        $_SESSION['authenticated'] = true;
    } else {
        echo '<form method="POST">
                <input type="password" name="password" placeholder="Enter password" required>
                <button type="submit">Login</button>
              </form>';
        exit;
    }
}

// === GOOGLE TTS SETUP ===
require_once 'tts/autoload.php'; // Load manual autoloader
use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
use Google\Cloud\TextToSpeech\V1\SynthesisInput;
use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;
use Google\Cloud\TextToSpeech\V1\AudioConfig;

// === GOOGLE API AUTHENTICATION ===
putenv('GOOGLE_APPLICATION_CREDENTIALS=tts/credentials.json'); // Change path if needed

// === PROCESS JSON INPUT ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['json_data'])) {
    $json_data = $_POST['json_data'];
    $data = json_decode($json_data, true);
    if (!$data) {
        echo "Invalid JSON format!";
        exit;
    }

    $client = new TextToSpeechClient();
    foreach ($data as $article) {
        foreach ($article['homework'] as $item) {
            $text = $item['text'];
            $clip_name = $item['clip'] . ".mp3";
            $file_path = "../assets/audios/" . $clip_name;

            // Skip if file already exists
            if (file_exists($file_path)) {
                continue;
            }

            // Prepare the text input
            $input = new SynthesisInput();
            $input->setText($text);

            // Set the voice properties
            $voice = new VoiceSelectionParams();
            $voice->setLanguageCode('en-US'); // Adjust language if needed
            $voice->setSsmlGender(1); // 1 = Male, 2 = Female

            // Set audio format
            $audioConfig = new AudioConfig();
            $audioConfig->setAudioEncoding(1); // 1 = MP3

            // Generate the speech
            $response = $client->synthesizeSpeech($input, $voice, $audioConfig);
            file_put_contents($file_path, $response->getAudioContent());

            echo "Saved: $clip_name<br>";
        }
    }

    $client->close();
    echo "Processing complete!";
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google TTS Downloader</title>
</head>
<body>
    <h2>Paste JSON Data</h2>
    <textarea id="jsonInput" rows="10" cols="50"></textarea>
    <br>
    <button onclick="sendToServer()">Download Audio</button>

    <script>
        function sendToServer() {
            const jsonData = document.getElementById('jsonInput').value;
            if (!jsonData.trim()) {
                alert("Please paste valid JSON data!");
                return;
            }

            const formData = new FormData();
            formData.append("json_data", jsonData);

            fetch("index.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.text())
            .then(data => alert(data))
            .catch(error => console.error("Error:", error));
        }
    </script>
</body>
</html>
