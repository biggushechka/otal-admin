<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'] ?? $_GET['id_site'];
$name_gallery = $POST['name_gallery'] ?? $_GET['name_gallery'];
$currentDateTime = date('Y-m-d H:i:s');

// Запись
if ($method === "POST") {

    $query_find_album = $dbh->prepare("SELECT * FROM `project_gallery_album` WHERE id_site = :id_site AND title = :title");
    $query_find_album->execute([
        "id_site" => $id_site,
        "title" => $name_gallery
    ]);
    $album = $query_find_album->fetch(PDO::FETCH_ASSOC);

    if ($query_find_album->rowCount() == 0) {
        $query_create_album = $dbh->prepare("INSERT INTO `project_gallery_album` SET
            `id_site` = :id_site,
            `title` = :title,
            `activity` = :activity,
            `date_create` = :date_create
        ");
        $query_create_album->execute([
            "id_site" => $id_site,
            "title" => $name_gallery,
            "activity" => "on",
            "date_create" => $currentDateTime
        ]);
        $album_id = $dbh->lastInsertId();

        if ($query_create_album->rowCount() != 0) {
            $query_get_album = $dbh->prepare("SELECT * FROM `project_gallery_album` WHERE `id` = :id");
            $query_get_album->execute(["id" => $album_id]);
            $new_album = $query_get_album->fetch(PDO::FETCH_OBJ);

            header("HTTP/1.1 200 OK");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($new_album, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 409 Conflict");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Ошибка при добавлении записи", JSON_UNESCAPED_UNICODE);
        }
    } else {
        header("HTTP/1.1 409 Conflict");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Альбом с таким названием уже существует", JSON_UNESCAPED_UNICODE);
    }

}

// Удаление
if ($method === "DELETE") {

}