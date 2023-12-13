<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

// добавление нового сайта
if ($method === "POST") {
    $title = $_POST['title'];
    $domain = $_POST['domain'];
    $currentDateTime = date('Y-m-d H:i:s');

    // проверяем, есть ли уже такой сайт в БД по (title, domain)
    $query_findSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `title` = :title OR `domain` = :domain LIMIT 1");
    $query_findSite->execute(["title" => $title, "domain" => $domain]);
    $isSite = $query_findSite->fetch(PDO::FETCH_OBJ);

    if ($isSite) {
        header("HTTP/1.1 409 Conflict");
        echo json_encode(["error"=>"Сайт с таким названием или доменом уже существует"], JSON_UNESCAPED_UNICODE);
    } else {
        $query_create_site = $dbh->prepare("INSERT INTO `my_sites` SET `title` = :title, `domain` = :domain, `date_create` = :date_create, `status` = :status");
        $query_create_site->execute(["title" => $title, "domain" => $domain, "date_create" => $currentDateTime, "status" => "on"]);

        $query_get_site = $dbh->prepare("SELECT * FROM `my_sites` WHERE `title` = :title AND `domain` = :domain LIMIT 1");
        $query_get_site->execute(["title" => $title, "domain" => $domain]);
        $newSite = $query_get_site->fetch(PDO::FETCH_OBJ);

        header("HTTP/1.1 201 Created");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($newSite, JSON_UNESCAPED_UNICODE);
    }

    die();
}

// получение сайта
if ($method === "GET") {
    $sth = $dbh->prepare("SELECT * FROM `my_sites`");
    $sth->execute();
    $my_sites = $sth->fetchAll(PDO::FETCH_ASSOC);

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($my_sites, JSON_UNESCAPED_UNICODE);
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(['user'=>null], JSON_UNESCAPED_UNICODE);
}

die();