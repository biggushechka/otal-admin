<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$refererDom = $_SERVER['HTTP_REFERER'];
$id_site = 0;

if (isset($refererDom) && $_GET['domain'] !== "" && $refererDom == "http://odal-jk/") {
    // разрешаем подключаться к API разрешенным доменам
    header("Access-Control-Allow-Origin: http://odal-jk");
    header("Access-Control-Allow-Credentials: true");

    // получение сайта
    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain LIMIT 1");
    $getSite->execute(["domain" => "https://" . $_GET['domain']]);

    if ($getSite->rowCount() > 0) {
        $site = $getSite->fetchAll(PDO::FETCH_ASSOC);
        $id_site = $site->id;
    } else {
        $dbh = null;
        header("HTTP/1.1 403 Forbidden");
        exit("Доступ запрещен ((");
    }

} else if (isset($_SERVER['HTTP_REFERER'])) {
    require_once "$rootPath/api/config/db_connect.php";

    $referer = parse_url($_SERVER['HTTP_REFERER']); // конвертирует URL в строку
    $refererDomain = $referer['host']; // получаем домен
    $ip_address = gethostbyname($refererDomain); // получаем IP-адрес по домену
    $ip_convert = ip2long($ip_address); // конвертируем IP-адрес

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
    exit("Доступ запрещен");
}

if ($dbh !== null) {
    $getContent = $_GET['content'];

    switch ($getContent) {
        case "global":
            echo "global $id_site";
            break;
        case "advantages":
            echo "advantages";
            break;
        case "gallery":
            echo "gallery";
            break;
        default:
            $dbh = null;
            header("HTTP/1.1 400 Bad request");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Bad request", JSON_UNESCAPED_UNICODE);
            exit();
    }
}