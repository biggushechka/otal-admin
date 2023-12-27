<?php

// Устанавливаем возможность отправлять ответ для некоторых доменов
$allowAccess = "";
$origin = $_SERVER['HTTP_ORIGIN'];

$allowedOrigins = [
    '',
    'http://odal'
];

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Credentials: true");
} else {
    // Сайт, не входящий в список разрешенных, получит ошибку доступа
    header("HTTP/1.1 403 Forbidden");
    exit("Доступ запрещен ((");
}