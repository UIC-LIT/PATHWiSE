<?php
// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method Not Allowed";
    exit;
}

// Read the incoming JSON
$data = json_decode(file_get_contents('php://input'), true);

// Optional: Validate required fields
$required = ['uid', 'time', 'name', 'target', 'info', 'state', 'version', 'article', 'username'];
foreach ($required as $field) {
    if (!isset($data[$field])) {
        http_response_code(400);
        echo "Missing field: $field";
        exit;
    }
}

// File path
$file = 'logs.csv';

// If file doesn't exist, add headers
if (!file_exists($file)) {
    $headers = ['UID', 'Time', 'EventName', 'Target', 'Info', 'State', 'Version', 'article', 'username'];
    $fp = fopen($file, 'w');
    fputcsv($fp, $headers);
    fclose($fp);
}

// Append log entry
$fp = fopen($file, 'a');
fputcsv($fp, [
    $data['uid'],
    $data['time'],
    $data['name'],
    $data['target'],
    $data['info'],
    $data['state'],
    $data['version'],
    $data['article'],
    $data['username']
]);
fclose($fp);

// Respond OK
http_response_code(200);
echo "Log saved.";
?>
