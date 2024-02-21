<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$domain = $_GET['domain'];

// Получение
if ($method === "GET") {
    // получаем ID проекта по domain
    $query_findSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain LIMIT 1");
    $query_findSite->execute(["domain" => $domain]);
    $isSite = $query_findSite->fetch(PDO::FETCH_OBJ);

    if ($isSite) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($isSite, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Такого сайта не существует", JSON_UNESCAPED_UNICODE);
    }

    $dbh = null;
    die();
}