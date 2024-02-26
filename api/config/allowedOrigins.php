<?php

header("Access-Control-Allow-Origin: https://alba-del-mare.ru");
header("Access-Control-Allow-Credentials: true");

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$referer = parse_url($_SERVER['HTTP_REFERER']);
$refererDomain = $referer['host'];


$ip = gethostbyname($refererDomain);
$ip_convert = ip2long($ip);
$ip_decod = long2ip($ip_convert);

echo "refererDomain: $refererDomain <br>";
echo "IP-адрес сайта: $ip <br>";
echo "IP-адрес сайта (convert): $ip_convert";
echo "IP-адрес сайта (decod): $ip_decod";


//if(isset($_SERVER['HTTP_REFERER'])) {
//    $referer = parse_url($_SERVER['HTTP_REFERER']);
//    $refererDomain = $referer['host'];
//
//    // Выполните необходимые действия на основе значения $refererDomain
//    echo "Запрос был отправлен с домена: " . $refererDomain;
//} else {
//    // Обработка случая, когда запрос не содержит HTTP_REFERER
//    echo "HTTP_REFERER не определен";
//}






// разрешаем подключаться к API разрешенным доменам
//if (in_array($refererDomain, $allowedOrigins)) {
//    header("Access-Control-Allow-Origin: " . $refererDomain);
//    header("Access-Control-Allow-Credentials: true");
//} else {
//    // Сайт, не входящий в список разрешенных, получит ошибку доступа
//    header("HTTP/1.1 403 Forbidden");
//    exit("Доступ запрещен ((");
//}