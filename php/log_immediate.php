<?php
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
$server_time = date('Y-m-d H:i:s');
$log = json_encode(['id' => $input['id'], 'client_time' => $input['time'], 'server_time' => $server_time, 'msg' => $input['msg']]) . "\n";
file_put_contents('../events_immediate.txt', $log, FILE_APPEND | LOCK_EX);
echo json_encode(['status' => 'ok']);
?>