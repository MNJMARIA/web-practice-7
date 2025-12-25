<?php
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
foreach ($input as $event) {
    $server_time = date('Y-m-d H:i:s');
    $log = json_encode(['id' => $event['id'], 'client_time' => $event['time'], 'server_time' => $server_time, 'msg' => $event['msg']]) . "\n";
    file_put_contents('../events_batch.txt', $log, FILE_APPEND | LOCK_EX);
}
localStorage.clear(); // не в PHP, але клієнт очистить
echo json_encode(['status' => 'ok']);
?>