<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$id_site = $_GET['id_site'];

// Получение
$query_get = $dbh->prepare("SELECT * FROM `site_location` WHERE `id_site` = :id_site LIMIT 1");
$query_get->execute(["id_site" => $id_site]);

if ($query_get->rowCount() > 0) {
    $data = $query_get->fetch(PDO::FETCH_OBJ);

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} else {
    header("HTTP/1.1 404 Not Found");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode("Данных нет", JSON_UNESCAPED_UNICODE);
}