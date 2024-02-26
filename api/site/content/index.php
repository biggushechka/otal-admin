<?php

global $dbh;

$rootPath = $_SERVER['DOCUMENT_ROOT'];
require_once $rootPath . '/api/config/db_connect.php';

$rootPath = $_SERVER['DOCUMENT_ROOT'];

if (isset($_SERVER['HTTP_REFERER'])) {
    $referer = parse_url($_SERVER['HTTP_REFERER']); // конвертирует URL в строку
    $refererDomain = $referer['host']; // получаем домен
    $ip = gethostbyname($refererDomain); // получаем IP-адрес по домену
    $ip_convert = ip2long($ip); // конвертируем IP-адрес

    // получение сайта
    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain AND `ip_address` = :ip_address LIMIT 1");
    $getSite->execute(["domain" => "https://" . $refererDomain, "ip_address" => $ip_convert]);

    if ($getSite->rowCount() > 0) {
        $site = $getSite->fetchAll(PDO::FETCH_ASSOC);

        // разрешаем подключаться к API разрешенным доменам
        header("Access-Control-Allow-Origin: https://" . $refererDomain);
        header("Access-Control-Allow-Credentials: true");
    } else {
        $dbh = null;
        header("HTTP/1.1 403 Forbidden");
        exit("Доступ запрещен ((");
    }

} else {
    $dbh = null;
    header("HTTP/1.1 403 Forbidden");
    exit("Доступ запрещен 222");
}

if ($dbh !== null) {
    echo "dbh";
}