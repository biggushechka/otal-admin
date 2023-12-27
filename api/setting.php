<?php

$origin = $_SERVER['HTTP_ORIGIN'];

// разрешенные домены
$allowedOrigins = [
    'http://otal-estate',
    'http://odal'
];

// Устанавливаем возможность отправлять ответ для разрешенных доменов

if ($origin != "") {
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: " . $origin);
        header('Access-Control-Allow-Methods: POST');
        header("Access-Control-Allow-Credentials: true");
    } else {
        // Сайт, не входящий в список разрешенных, получит ошибку доступа
        header("HTTP/1.1 403 Forbidden");
        exit("Доступ запрещен ((");
    }
}