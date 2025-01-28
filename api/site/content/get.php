<?php
$rootPath = $_SERVER['DOCUMENT_ROOT'];
$refererDom = $_SERVER['HTTP_REFERER'];
$fakeDomain = $_GET["domain"];
$id_site = 0;

require_once "$rootPath/api/config/db_connect.php";

if (isset($refererDom) && isset($fakeDomain) && $refererDom == "http://localhost/") {

    // разрешаем подключаться к API
    header("Access-Control-Allow-Origin: http://localhost/");
    header("Access-Control-Allow-Credentials: true");

    // получение сайта
    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain LIMIT 1");
    $getSite->execute(["domain" => "https://$fakeDomain"]);

    if ($getSite->rowCount() > 0) {
        $site = $getSite->fetch(PDO::FETCH_OBJ);
        $id_site = $site->id;
    } else {
        $dbh = null;
        header("HTTP/1.1 403 Forbidden");
        exit("Доступ запрещен-0 (( $refererDom");
    }

} else if (isset($refererDom)) {
    $referer = parse_url($_SERVER['HTTP_REFERER']); // конвертирует URL в строку
    $refererDomain = $referer['host']; // получаем домен
    $ip_address = gethostbyname($refererDomain); // получаем IP-адрес по домену
    $ip_convert = ip2long($ip_address); // конвертируем IP-адрес

    // получение сайта
//    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain AND `ip_address` = :ip_address LIMIT 1");
    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain LIMIT 1");
    $getSite->execute([
        "domain" => "https://$refererDomain",
//        "ip_address" => $ip_convert
    ]);

    if ($getSite->rowCount() > 0) {
        $site = $getSite->fetch(PDO::FETCH_OBJ);
        $id_site = $site->id;

        // разрешаем подключаться к API разрешенным доменам
        header("Access-Control-Allow-Origin: https://" . $refererDomain);
        header("Access-Control-Allow-Credentials: true");
    } else {
        $dbh = null;
        header("HTTP/1.1 403 Forbidden");
        exit("Доступ запрещен-1 (( $refererDomain");
    }

} else {
    $dbh = null;
    header("HTTP/1.1 403 Forbidden");
    exit("Доступ запрещен-2");
}


if ($dbh !== null) {
    switch ($_GET['content']) {
        case "global": // Общая информация
            require_once "general.php";
            getGeneral($id_site);
            break;
        case "advantages": // преимущества
            require_once "advantages.php";
            getAdvantages($id_site);
            break;
        case "mainSlider": // верхний слайдер
            require_once "mainSlider.php";
            getMainSlider($id_site);
            break;
        case "about": // о проекте
            require_once "about-project.php";
            getAboutProject($id_site);
            break;
        case "infrastructure": // инфраструктура
            require_once "infrastructure.php";
            getInfrastructure($id_site);
            break;
        case "gallery": // галерея
            require_once "gallery.php";
            getGallery($id_site);
            break;
        case "banks": // банки
            require_once "banks.php";
            getBanks($id_site);
            break;
        case "meta": // Meta
            require_once "meta.php";
            meta($id_site);
            break;
        default:
            $dbh = null;
            header("HTTP/1.1 400 Bad request");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Bad request", JSON_UNESCAPED_UNICODE);
            exit();
    }
}