<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$id_site = $_GET['id_site'];
$target = $_GET['target'];
$db_table = "";
$data = "";

if ($target === "about") {
    $db_table = "site_desc_about";
} else if ($target === "territory") {
    $db_table = "site_desc_territory";
}

$query_get_desc = $dbh->prepare("SELECT * FROM `$db_table` WHERE `id_site` = :id_site LIMIT 1");
$query_get_desc->execute(["id_site" => $id_site]);

if ($query_get_desc->rowCount() == 0) {
    $query_creat = $dbh->prepare("INSERT INTO `$db_table` SET `id_site` = :id_site");
    $query_creat->execute(["id_site" => $id_site]);

    if ($query_creat->rowCount() > 0) {
        $lastInsertId = $dbh->lastInsertId();

        $query_get_desc = $dbh->prepare("SELECT * FROM `$db_table` WHERE `id_site` = :id_site LIMIT 1");
        $query_get_desc->execute(["id_site" => $id_site]);
        $data = $query_get_desc->fetch(PDO::FETCH_OBJ);
    } else {
        header("HTTP/1.1 400 Bad request");
        echo json_encode($data, JSON_UNESCAPED_UNICODE);

        $dbh = null;
        die();
    }
} else {
    $data = $query_get_desc->fetch(PDO::FETCH_ASSOC);
}

if ($data !== "") {
    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}

$dbh = null;
die();