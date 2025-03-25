<?php
// Load Google Cloud Text-to-Speech manually
require_once __DIR__ . '/src/V1/TextToSpeechClient.php';
require_once __DIR__ . '/src/V1/Gapic/TextToSpeechGapicClient.php';
require_once __DIR__ . '/src/V1/TextToSpeechGrpcClient.php';

// Load required gRPC files
require_once __DIR__ . '/src/V1/resources/text_to_speech_rest_client_config.php';
