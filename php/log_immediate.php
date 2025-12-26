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
$input = json_decode(file_get_contents('php://input'), true);
$server_time = date('Y-m-d H:i:s');
$log = json_encode(['id' => $input['id'], 'client_time' => $input['time'], 'server_time' => $server_time, 'msg' => $input['msg']]) . "\n";
file_put_contents('../events_immediate.txt', $log, FILE_APPEND | LOCK_EX);
echo json_encode(['status' => 'ok']);
?>