<?php
// Read the JSON data sent from JavaScript
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Get Misty IP and Behavior Name from the received data
$mistyIP = isset($data['mistyIP']) ? $data['mistyIP'] : null;
$behaviorName = isset($data['behaviorName']) ? $data['behaviorName'] : null;

// Validate the received data
if (!$mistyIP) {
    echo json_encode(['status' => 'error', 'message' => 'API: Misty IP is missing.']);
    exit();
}

if (!$behaviorName) {
    echo json_encode(['status' => 'error', 'message' => 'API: Behavior name is missing.']);
    exit();
}

// Function to keep Misty awake by sending an HTTP request to a Misty API endpoint
function keepMistyAwake($mistyIP) {
    $url = "http://$mistyIP/api/status"; // Misty status endpoint to keep it awake
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

// Function to play audio on Misty
function playAudio($mistyIP, $audioSrc) {
    $url = "http://$mistyIP/api/audio/play"; // Misty audio play endpoint
    $ch = curl_init($url);
    $payload = json_encode(["AudioClip": $audioSrc]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

// Function to execute behavior by parsing the instructions from the behavior name
function executeBehavior($mistyIP, $behaviorName) {
    $behaviors = [
        'default' => 'SL 1000\nFI image.png\nTL 255 0 0 0 255 0 linear 1000\nMH 0 30 0 50\nMAS 50 10 50 10',
        'example_behavior' => 'SL 2000\nFI example_image.png\nTL 0 255 0 255 0 0 pulse 500\nMH 30 60 0 100\nMAS 100 15 100 15',
    ];

    // Get the behavior content (fallback to default if behavior not found)
    $behaviorContent = isset($behaviors[$behaviorName]) ? $behaviors[$behaviorName] : $behaviors['default'];
    $instructions = explode("\n", $behaviorContent);

    foreach ($instructions as $instruction) {
        $args = explode(' ', trim($instruction));
        if (count($args) < 2) continue;

        switch ($args[0]) {
            case 'SL':
                usleep(intval($args[1]) * 1000); // Sleep for the specified milliseconds
                break;
            case 'FI':
                $imageFile = $args[1];
                $response = playImage($mistyIP, $imageFile);
                break;
            case 'TL':
                // Handle LED transition
                $response = transitionLED($mistyIP, $args);
                break;
            case 'MH':
                // Handle head movement
                $response = moveHead($mistyIP, $args);
                break;
            case 'MAS':
                // Handle arm movement
                $response = moveArms($mistyIP, $args);
                break;
            default:
                break;
        }
    }

    return ['status' => 'success', 'message' => 'Behavior executed successfully'];
}

// Keep Misty awake
keepMistyAwake($mistyIP);

// Execute the behavior
$result = executeBehavior($mistyIP, $behaviorName);

// Send the result back to JavaScript
echo json_encode($result);

?>
