<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'] ?? $_GET['id_site'];
$target = $POST['target'] ?? $_GET['target'];
$title_jk = $POST['title_jk'] ?? $_GET['title_jk'];
$desc_jk = $POST['desc_jk'] ?? $_GET['desc_jk'];
$title_territory = $POST['title_territory'] ?? $_GET['title_territory'];
$desc_territory = $POST['desc_territory'] ?? $_GET['desc_territory'];
$currentDateTime = date('Y-m-d H:i:s');

// Получение
if ($method === "GET") {
    $query_get_desc = $dbh->prepare("SELECT * FROM `site_description` WHERE `id_site` = :id_site LIMIT 1");
    $query_get_desc->execute(["id_site" => $id_site]);
    $desc = $query_get_desc->fetch(PDO::FETCH_OBJ);

    if ($query_get_desc->rowCount() != 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($desc, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
    }
}