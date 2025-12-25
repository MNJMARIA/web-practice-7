<?php
header('Content-Type: application/json');
$file = '../events_immediate.txt'; // або events_batch.txt
if (file_exists($file)) {
    $lines = file($file, FILE_IGNORE_NEW_LINES);
    $data = array_map('json_decode', $lines);
    echo json_encode($data);
} else {
    echo json_encode([]);
}
?>