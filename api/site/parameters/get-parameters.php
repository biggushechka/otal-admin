<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$id_site = $POST['id_site'] ?? $_GET['id_site'];

$query_get_parameters = $dbh->prepare("SELECT * FROM `site_parameters` WHERE `id_site` = :id_site LIMIT 1");
$query_get_parameters->execute(["id_site" => $id_site]);
$parameters = "";

// проверям, есть ли строка
// если нет, то создаем пустую строку
if ($query_get_parameters->rowCount() == 0) {
    $query_creat = $dbh->prepare("INSERT INTO `site_parameters` SET `id_site` = :id_site");
    $query_creat->execute(["id_site" => $id_site]);
    $lastInsertId = $dbh->lastInsertId();

    $query_get_parameters = $dbh->prepare("SELECT * FROM `site_parameters` WHERE `id_site` = :id_site LIMIT 1");
    $query_get_parameters->execute(["id_site" => $id_site]);
    $data = $query_get_parameters->fetch(PDO::FETCH_OBJ);
} else {
    $data = $query_get_parameters->fetch(PDO::FETCH_OBJ);
}

header("HTTP/1.1 200 OK");
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($data, JSON_UNESCAPED_UNICODE);

$dbh = null;
die();