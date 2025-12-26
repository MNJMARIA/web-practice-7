<?php
header('Content-Type: application/json');

$file = '../events_batch.txt';

if (file_exists($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $data = [];

    foreach ($lines as $line) {
        $decoded = json_decode($line, true);
        if ($decoded !== null) {
            $data[] = $decoded;
        }
    }

    echo json_encode($data);
} else {
    echo json_encode([]);
}
