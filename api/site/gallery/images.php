<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_album = $POST['id_gallery'] ?? $_GET['id_gallery'];
$id_site = $POST['id_site'] ?? $_GET['id_site'];
$currentDateTime = date('Y-m-d H:i:s');

// получение
if ($method === "GET") {
    $query_get_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE id_site = :id_site AND id_album = :id_album");
    $query_get_images->execute([
        "id_site" => $id_site,
        "id_album" => $id_album
    ]);
    $images = $query_get_images->fetchAll(PDO::FETCH_ASSOC);

    if ($query_get_images->rowCount() > 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($images, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 OK");
        header('Content-Type: application/json; charset=UTF-8');
    }
}

// Запись
if ($method === "POST") {

}

// Удаление
if ($method === "DELETE") {

}