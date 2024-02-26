<?php

header("Access-Control-Allow-Origin: https://alba-del-mare.ru");
header("Access-Control-Allow-Credentials: true");

$rootPath = $_SERVER['DOCUMENT_ROOT'];

if(isset($_SERVER['HTTP_REFERER'])) {
    $referer = parse_url($_SERVER['HTTP_REFERER']); // конвертирует URL в строку
    $refererDomain = $referer['host']; // получаем домен
    $ip = gethostbyname($refererDomain); // получаем IP-адрес по домену
    $ip_convert = ip2long($ip); // конвертируем IP-адрес


    // получение сайта
    $getSites = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain AND `ip_address` = :ip_address LIMIT 1");
    $getSites->execute(["domain" => "https://" . $refererDomain, "ip_address" => $ip_convert]);
    $site = $getSites->fetchAll(PDO::FETCH_ASSOC);

    print_r($site);

} else {
    // Обработка случая, когда запрос не содержит HTTP_REFERER
    echo "HTTP_REFERER не определен";
}






// разрешаем подключаться к API разрешенным доменам
//if (in_array($refererDomain, $allowedOrigins)) {
//    header("Access-Control-Allow-Origin: " . $refererDomain);
//    header("Access-Control-Allow-Credentials: true");
//} else {
//    // Сайт, не входящий в список разрешенных, получит ошибку доступа
//    header("HTTP/1.1 403 Forbidden");
//    exit("Доступ запрещен ((");
//}