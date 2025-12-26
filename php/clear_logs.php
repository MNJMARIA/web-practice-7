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

// Масив файлів для очищення
$files = [
    '../events_immediate.txt',
    '../events_batch.txt'
];

$results = [];

foreach ($files as $file) {
    if (file_exists($file)) {
        // Очищаємо файл (записуємо порожній рядок)
        if (file_put_contents($file, '') !== false) {
            $results[$file] = 'cleared';
        } else {
            $results[$file] = 'error';
        }
    } else {
        // Створюємо порожній файл, якщо не існує
        file_put_contents($file, '');
        $results[$file] = 'created empty';
    }
}

// Також очистимо LocalStorage на клієнті (це зробить JS)
echo json_encode([
    'status' => 'success',
    'message' => 'Logs cleared successfully',
    'results' => $results
]);
?>