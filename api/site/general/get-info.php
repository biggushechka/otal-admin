<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$id_site = $_GET['id_site'];

$query_get_general = $dbh->prepare("SELECT * FROM `site_general` WHERE `id_site` = :id_site LIMIT 1");
$query_get_general->execute(["id_site" => $id_site]);
$data = "";

// проверям, есть ли строка
// если нет, то создаем пустую строку
if ($query_get_general->rowCount() == 0) {
    $query_creat = $dbh->prepare("INSERT INTO `site_general` SET `id_site` = :id_site");
    $query_creat->execute(["id_site" => $id_site]);
    $lastInsertId = $dbh->lastInsertId();

    $query_get_general = $dbh->prepare("SELECT * FROM `site_general` WHERE `id_site` = :id_site LIMIT 1");
    $query_get_general->execute(["id_site" => $id_site]);
    $data = $query_get_general->fetch(PDO::FETCH_OBJ);
} else {
    $data = $query_get_general->fetch(PDO::FETCH_OBJ);
}

header("HTTP/1.1 200 OK");
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data, JSON_UNESCAPED_UNICODE);

$dbh = null;
die();