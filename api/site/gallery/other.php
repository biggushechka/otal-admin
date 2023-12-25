<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'] ?? $_GET['id_site'];
$name_gallery = $POST['name_gallery'] ?? $_GET['name_gallery'];
$currentDateTime = date('Y-m-d H:i:s');


// Получение
if ($method === "GET") {

    if ($name_gallery == "all") {
        $query_get = $dbh->prepare("SELECT * FROM `project_gallery_album` WHERE id_site = :id_site");
        $query_get->execute(["id_site" => $id_site]);
        $allAlbum = $query_get->fetchAll(PDO::FETCH_OBJ);

        if ($query_get->rowCount() != 0) {
            header("HTTP/1.1 200 OK");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($allAlbum, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 204 Not Found");
            header('Content-Type: application/json; charset=UTF-8');
        }
    }

}

// Запись
if ($method === "POST") {

}

// Удаление
if ($method === "DELETE") {

}