<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if (is_array($input)) {
    foreach ($input as $event) {
        $server_time = date('Y-m-d H:i:s');

        $log = json_encode([
            'id' => $event['id'],
            'client_time' => $event['time'],
            'server_time' => $server_time,
            'msg' => $event['msg']
        ]) . PHP_EOL;

        file_put_contents('../events_batch.txt', $log, FILE_APPEND | LOCK_EX);
    }
}

echo json_encode(['status' => 'ok']);
