<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$postdata = file_get_contents("php://input");
$data = json_decode($postdata, true);

$title = $data['title'] ?? $_GET['title'];
$domain = $data['domain'] ?? $_GET['domain'];
$currentDateTime = date('Y-m-d H:i:s');

// добавление нового сайта
if ($method === "POST") {
    // проверяем, есть ли уже такой сайт в БД по (title, domain)
    $query_findSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `title` = :title OR `domain` = :domain LIMIT 1");
    $query_findSite->execute(["title" => $title, "domain" => $domain]);
    $isSite = $query_findSite->fetch(PDO::FETCH_OBJ);

    if ($isSite) {
        header("HTTP/1.1 400 Bad Request");
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

    die();
}

// получение сайта
if ($method === "GET") {
    $sth = $dbh->prepare("SELECT * FROM `my_sites`");
    $sth->execute();
    $my_sites = $sth->fetchAll(PDO::FETCH_ASSOC);

    $allowedOrigins = [];
    foreach ($my_sites as $site) {
        $allowedOrigins[] = $site['domain'];
    }
    $jsonString = json_encode($allowedOrigins);
    file_put_contents($rootPath . "/api/config/allowed-origins.txt", $jsonString);


    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($my_sites, JSON_UNESCAPED_UNICODE);
}


// удаление сайта
if ($method === "DELETE") {
    // проверяем, есть ли уже такой сайт в БД по (title, domain)
    $query_findSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain LIMIT 1");
    $query_findSite->execute(["domain" => $domain]);
    $isSite = $query_findSite->fetch(PDO::FETCH_OBJ);

    if ($isSite) {
        $query_deleteSite = $dbh->prepare("DELETE FROM `my_sites` WHERE `domain` = :domain");
        $query_deleteSite->execute(["domain" => $domain]);

        header("HTTP/1.1 200 Delete");
        echo json_encode("Сайт был успешно удален", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode("Сайт с таким доменом не найден", JSON_UNESCAPED_UNICODE);
    }
}

die();