<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$activity = isset($_POST['activity']) ? $_POST['activity'] : (isset($_GET['activity']) ? $_GET['activity'] : null);
$domain = isset($_POST['domain']) ? $_POST['domain'] : (isset($_GET['domain']) ? $_GET['domain'] : null);
$currentDateTime = date('Y-m-d H:i:s');

// изменяем активность сайта
if ($method === "POST") {
    // проверяем, есть ли уже такой сайт в БД по (title, domain)
    $query_findSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain LIMIT 1");
    $query_findSite->execute(["domain" => $domain]);
    $isSite = $query_findSite->fetch(PDO::FETCH_OBJ);

    if ($isSite) {
        $changeActivity = ($activity == "true") ? "on" : "off";
        $query_updateActivity = $dbh->prepare("UPDATE `my_sites` SET `activity` = :activity WHERE `domain` = :domain");
        $query_updateActivity->execute(["activity" => $changeActivity, "domain" => $domain]);

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(["activity"=>$changeActivity, "domain"=>$domain], JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 409 Conflict");
        echo json_encode("Сайт с таким названием или доменом уже существует", JSON_UNESCAPED_UNICODE);
    }
}