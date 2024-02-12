<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';
require_once $rootPath . '/backend/functions.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'] ?? $_GET['id_site'];
$album = $POST['album'] ?? $_GET['album'];
$name_album = $POST['name_album'] ?? $_GET['name_album'];
$currentDateTime = date('Y-m-d H:i:s');

// Запись
if ($method === "GET") {
    // делаем запрос, есть ли главный альбом
    $query_find_album = $dbh->prepare("SELECT * FROM `project_gallery_album` WHERE id_site = :id_site AND title = :title");
    $query_find_album->execute([
        "id_site" => $id_site,
        "title" => "Основной альбом"
    ]);

    // проверям, есть ли главный альбом
    if ($query_find_album->rowCount() == 0) {
        $query_creat_main_album = $dbh->prepare("INSERT INTO `project_gallery_album` SET
            `id_site` = :id_site,
            `title` = :title,
            `activity` = :activity,
            `date_create` = :date_create
        ");
        $query_creat_main_album->execute([
            "id_site" => $id_site,
            "title" => "Основной альбом",
            "activity" => "on",
            "date_create" => $currentDateTime
        ]);
    }

    // запрос на все альбомы для кокнретного сайта
    if ($album == "all") {
        $query_get_all_album = $dbh->prepare("SELECT * FROM `project_gallery_album` WHERE id_site = :id_site");
        $query_get_all_album->execute(["id_site" => $id_site]);
        $all_album = $query_get_all_album->fetchAll(PDO::FETCH_ASSOC);

        if ($query_get_all_album->rowCount() != 0) {
            header("HTTP/1.1 200 OK");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($all_album, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 204 OK");
            header('Content-Type: application/json; charset=UTF-8');
        }
    }
}

// Запись
if ($method === "POST") {
    $query_find_album = $dbh->prepare("SELECT * FROM `project_gallery_album` WHERE id_site = :id_site AND title = :title");
    $query_find_album->execute([
        "id_site" => $id_site,
        "title" => $name_album
    ]);

    if ($query_find_album->rowCount() == 0) {
        $query_create_album = $dbh->prepare("INSERT INTO `project_gallery_album` SET
            `id_site` = :id_site,
            `title` = :title,
            `activity` = :activity,
            `date_create` = :date_create
        ");
        $query_create_album->execute([
            "id_site" => $id_site,
            "title" => $name_album,
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
            header("HTTP/1.1 400 Bad Request");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Ошибка при добавлении записи", JSON_UNESCAPED_UNICODE);
        }
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Альбом с таким названием уже существует", JSON_UNESCAPED_UNICODE);
    }

}

// Удаление
if ($method === "UPDATE") {
    $new_name_album = $_GET['title'];
    $id_album = $_GET['id'];

    $query_find_album = $dbh->prepare("SELECT * FROM `project_gallery_album` WHERE id_site = :id_site AND title = :title");
    $query_find_album->execute([
        "id_site" => $id_site,
        "title" => $new_name_album
    ]);

    if ($query_find_album->rowCount() == 0) {
        $query_get_album = $dbh->prepare("UPDATE `project_gallery_album` SET `title` = :title WHERE `id` = :id");
        $query_get_album->execute(["title" => $new_name_album, "id" => $id_album]);

        if ($query_get_album->rowCount() > 0) {
            header("HTTP/1.1 200 UPDATE");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($new_name_album, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 400 Bad Request");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("error", JSON_UNESCAPED_UNICODE);
        }
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Альбом с таким названием уже существует", JSON_UNESCAPED_UNICODE);
    }
}

// Удаление
if ($method === "DELETE") {
    $id_album = $_GET['id_album'];
    $deleteCount = 0;

    $query_find_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE id_site = :id_site AND id_album = :id_album");
    $query_find_images->execute([
        "id_site" => $id_site,
        "id_album" => $id_album
    ]);
    $allImages = $query_find_images->fetchAll(PDO::FETCH_ASSOC);

    foreach ($allImages as &$image) {
        $parsed_url = parse_url($image['image']);
        $pathFile = $parsed_url['path'];
        $pathFile = ltrim($pathFile, '/');

        // удаляем файл на сервере
        $delete_file = deleteFile($pathFile);

        if ($delete_file != "false") {
            $query_delete_row = $dbh->prepare("DELETE FROM `project_gallery_image` WHERE `id` = :id");
            $query_delete_row->execute(["id" => $image['id']]);

            if ($query_delete_row->rowCount() > 0) {
                $deleteCount++;
            }
        }
    }

    if ($deleteCount == count($allImages)) {
        $query_delete_album = $dbh->prepare("DELETE FROM `project_gallery_album` WHERE `id` = :id");
        $query_delete_album->execute(["id" => $id_album]);

        if ($query_delete_album->rowCount() > 0) {
            header("HTTP/1.1 200 UPDATE");
            header('Content-Type: application/json; charset=UTF-8');
        } else {
            header("HTTP/1.1 400 Bad Request");
            header('Content-Type: application/json; charset=UTF-8');
        }
    }
}