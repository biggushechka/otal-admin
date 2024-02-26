<?php

header("Access-Control-Allow-Origin: https://alba-del-mare.ru");
header("Access-Control-Allow-Credentials: true");

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$referer = parse_url($_SERVER['HTTP_REFERER']);
$refererDomain = $referer['host'];

echo "refererDomain: $refererDomain";

file_put_contents($rootPath . "/api/config/allowedOrigins.txt", $refererDomain);


// разрешаем подключаться к API разрешенным доменам
//if (in_array($refererDomain, $allowedOrigins)) {
//    header("Access-Control-Allow-Origin: " . $refererDomain);
//    header("Access-Control-Allow-Credentials: true");
//} else {
//    // Сайт, не входящий в список разрешенных, получит ошибку доступа
//    header("HTTP/1.1 403 Forbidden");
//    exit("Доступ запрещен ((");
//}