<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

// Устанавливаем токен бота и идентификатор чата
$botToken = '6992664105:AAGlVd1qXIqcUpZEXCcfF1qFI-Z3i32vWz0';
$chatId = '-1002160719822';
$message = 'Пример *жирного* и _курсивного_ текста';

// Отправляем POST-запрос на API Telegram для отправки сообщения
$url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage';
$data = array('chat_id' => $chatId, 'text' => $message, 'parse_mode' => 'Markdown');
$options = array(
    'http' => array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => http_build_query($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// Выводим результат отправки сообщения
print_r($result);


$dbh = null;
die();