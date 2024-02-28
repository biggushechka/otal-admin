<?php

// разрешаем подключаться к API
header("Access-Control-Allow-Origin: http://odal-jk");
header("Access-Control-Allow-Credentials: true");

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$refererDom = $_SERVER['HTTP_REFERER'];
$id_site = 0;

require_once "$rootPath/api/config/db_connect.php";

if (isset($refererDom) && isset($_GET["domain"]) && $refererDom == "http://odal-jk/") {
    // получение сайта
    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain LIMIT 1");
    $getSite->execute(["domain" => "https://" . $_GET['domain']]);

    if ($getSite->rowCount() > 0) {
        $site = $getSite->fetch(PDO::FETCH_OBJ);
        $id_site = $site->id;
    } else {
        $dbh = null;
        header("HTTP/1.1 403 Forbidden");
        exit("Доступ запрещен ((");
    }

} else if (isset($_SERVER['HTTP_REFERER']) && !isset($_GET['domain'])) {
    $referer = parse_url($_SERVER['HTTP_REFERER']); // конвертирует URL в строку
    $refererDomain = $referer['host']; // получаем домен
    $ip_address = gethostbyname($refererDomain); // получаем IP-адрес по домену
    $ip_convert = ip2long($ip_address); // конвертируем IP-адрес

    // получение сайта
    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain AND `ip_address` = :ip_address LIMIT 1");
    $getSite->execute(["domain" => "https://" . $refererDomain, "ip_address" => $ip_convert]);

    if ($getSite->rowCount() > 0) {
        $site = $getSite->fetch(PDO::FETCH_OBJ);
        $id_site = $site->id;

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
    switch ($_GET['content']) {
        case "global":
            require_once "general.php";
            getGeneral($id_site);
            break;
        case "advantages":
            require_once "advantages.php";
            getAdvantages($id_site);
            break;
        case "mainSlider":
            require_once "mainSlider.php";
            getMainSlider($id_site);
            break;
        default:
            $dbh = null;
            header("HTTP/1.1 400 Bad request");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Bad request", JSON_UNESCAPED_UNICODE);
            exit();
    }
}