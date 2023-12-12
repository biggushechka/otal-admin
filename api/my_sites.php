<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

if ($method === "POST") {
    $title = $_POST['title'];
    $domain = $_POST['domain'];
    $currentDateTime = date('Y-m-d H:i:s');

    $sth = $dbh->prepare("INSERT INTO `my_sites` SET `title` = :title, `domain` = :domain, `date_create` = :date_create, `status` = :status");
    $sth->execute(["title" => $title, "domain" => $domain, "date_create" => $currentDateTime, "status" => "on"]);

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['addSite'=>'добавлен'], JSON_UNESCAPED_UNICODE);

    die();
} else if ($method === "GET") {
    $sth = $dbh->prepare("SELECT * FROM `my_sites`");
    $sth->execute();
    $my_sites = $sth->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($my_sites, JSON_UNESCAPED_UNICODE);
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(['user'=>null], JSON_UNESCAPED_UNICODE);
}

die();