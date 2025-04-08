<?php
// get-access-token.php

$credentials = json_decode(file_get_contents('credentials.json'), true);
$now = time();
$expiry = $now + 3600;

$jwtHeader = [
    'alg' => 'RS256',
    'typ' => 'JWT',
    'kid' => $credentials['private_key_id'],
];
$jwtClaim = [
    'iss' => $credentials['client_email'],
    'scope' => 'https://www.googleapis.com/auth/cloud-platform',
    'aud' => 'https://oauth2.googleapis.com/token',
    'exp' => $expiry,
    'iat' => $now
];

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

$headerEncoded = base64url_encode(json_encode($jwtHeader));
$claimEncoded = base64url_encode(json_encode($jwtClaim));
$signatureInput = "$headerEncoded.$claimEncoded";

$signature = '';
openssl_sign($signatureInput, $signature, $credentials['private_key'], 'sha256WithRSAEncryption');
$jwt = "$signatureInput." . base64url_encode($signature);

// Exchange JWT for access token
$response = file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt
        ])
    ]
]));

http_response_code(200);
header('Content-Type: application/json');
echo $response;