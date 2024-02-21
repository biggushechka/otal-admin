<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$title = $POST['title'];
$domain = $POST['domain'];
$currentDateTime = date('Y-m-d H:i:s');

// проверяем, есть ли уже такой сайт в БД по (title, domain)
$query_findSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `title` = :title OR `domain` = :domain LIMIT 1");
$query_findSite->execute(["title" => $title, "domain" => $domain]);
$isSite = $query_findSite->fetch(PDO::FETCH_OBJ);

// если сайт уже существет, то выдаем ошибку
if ($isSite) {
    header("HTTP/1.1 304 Not Modified");
    echo json_encode("Сайт с таким названием или доменом уже существует", JSON_UNESCAPED_UNICODE);
} else {
    $query_create_site = $dbh->prepare("INSERT INTO `my_sites` SET `title` = :title, `domain` = :domain, `date_create` = :date_create, `activity` = :activity");
    $query_create_site->execute([
        "title" => $title,
        "domain" => $domain,
        "date_create" => $currentDateTime,
        "activity" => "on"
    ]);

    $query_get_site = $dbh->prepare("SELECT * FROM `my_sites` WHERE `title` = :title AND `domain` = :domain LIMIT 1");
    $query_get_site->execute(["title" => $title, "domain" => $domain]);
    $newSite = $query_get_site->fetch(PDO::FETCH_OBJ);

    header("HTTP/1.1 201 Created");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($newSite, JSON_UNESCAPED_UNICODE);
}

$dbh = null;
die();