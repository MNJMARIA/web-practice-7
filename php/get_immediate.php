<?php
// Дозволити CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
date_default_timezone_set('Europe/Kyiv');

// Обробити preflight OPTIONS запит
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Перевірка на POST (для логування)
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)) {
    $_POST = json_decode(file_get_contents('php://input'), true);
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$file = '../events_immediate.txt';

if (file_exists($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $data = [];

    foreach ($lines as $line) {
        $decoded = json_decode($line, true);
        if ($decoded !== null) {
            // Форматуємо для відображення в таблиці
            $data[] = [
                'id' => $decoded['id'],
                'msg' => $decoded['msg'],
                'server_time' => $decoded['server_time']
            ];
        }
    }

    echo json_encode($data);
} else {
    echo json_encode([]);
}