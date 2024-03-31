<?php

// разрешаем подключаться к API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];
$refererDom = $_SERVER['HTTP_REFERER'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);
$id_site = 0;

if (isset($refererDom)) {
    $referer = parse_url($_SERVER['HTTP_REFERER']); // конвертирует URL в строку
    $refererDomain = $referer['host']; // получаем домен
    $ip_address = gethostbyname($refererDomain); // получаем IP-адрес по домену
    $ip_convert = ip2long($ip_address); // конвертируем IP-адрес

    // получение сайта
    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain AND `ip_address` = :ip_address LIMIT 1");
    $getSite->execute(["domain" => "https://$refererDomain", "ip_address" => $ip_convert]);

    if ($getSite->rowCount() > 0) {
        $site = $getSite->fetch(PDO::FETCH_OBJ);
        $id_site = $site->id;
    } else {
        $dbh = null;
        header("HTTP/1.1 403 Forbidden");
        exit("Доступ запрещен-1 (( $refererDomain");
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $type = (isset($POST["type"]) === true) ? isset($POST["type"]) : "";
    $name = (isset($POST["name"]) === true) ? isset($POST["name"]) : "";
    $phone = (isset($POST["phone"]) === true) ? isset($POST["phone"]) : "";
    $email = (isset($POST["email"]) === true) ? isset($POST["email"]) : "";
    $comment = (isset($POST["comment"]) === true) ? isset($POST["comment"]) : "";
    $currentDateTime = date('Y-m-d H:i:s');


    $query_add = $dbh->prepare("INSERT INTO `site_orders` SET
        `id_site` = :id_site,
        `type` = :type,
        `name` = :name,
        `phone` = :phone,
        `email` = :email,
        `comment` = :comment,
        `date_create` = :date_create
    ");

    $query_add->execute([
        "id_site" => $id_site,
        "type" => $type,
        "name" => $name,
        "phone" => $phone,
        "email" => $email,
        "comment" => $comment,
        "date_create" => $currentDateTime
    ]);

    if ($query_add->rowCount() > 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Отправлено!", JSON_UNESCAPED_UNICODE);
    }
}