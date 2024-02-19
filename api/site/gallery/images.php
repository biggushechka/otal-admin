<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';
require_once $rootPath . '/backend/functions.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'] ?? $_GET['id_site'];
$id_album = $POST['id_album'] ?? $_GET['id_album'];
$name_album = $POST['name_album'] ?? $_GET['name_album'];
$images = $POST['photos'] ?? $_GET['photos'];
$activity = $POST['activity'] ?? $_GET['activity'];
$replacement = $POST['replacement'];
$titleAlbum = "gallery";
$currentDateTime = date('Y-m-d H:i:s');

// получение
if ($method === "GET") {
    $query_get_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE `id_site` = :id_site AND `id_album` = :id_album");
    $query_get_images->execute(["id_site" => $id_site, "id_album" => $id_album]);
    $getImages = $query_get_images->fetchAll(PDO::FETCH_ASSOC);

    if ($query_get_images->rowCount() != 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($getImages, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
    }
}

// Запись
if ($method === "POST") {

    if ($replacement === "true") {
        photoReplacement();
        return false;
    }

    $album_id = "";

    // ковертируем фото в webp
    $webpImages = convertImagesToWebP($images);
    $addedPhotos = [];

    // добавляем фото в альбом
    foreach ($webpImages as &$image) {
        $saveImgPath = "api/media/" . $titleAlbum;
        $titleImg = $image['name'] . "." . $image['ext'];
        $saveImg = saveFile($image, $saveImgPath);
        $filePath = "https://otal-estate.ru/" . $saveImgPath . "/" . $titleImg;

        if ($saveImg != "false") {
            // добавляем фото в таблицу "project_photos"
            $query_add_image = $dbh->prepare("INSERT INTO `project_gallery_image` SET
                `id_album` = :id_album,
                `id_site` = :id_site,
                `name_album` = :name_album,
                `title` = :title,
                `extension` = :extension,
                `weight` = :weight,
                `image` = :image,
                `activity` = :activity,
                `date_create` = :date_create
            ");
            $query_add_image->execute([
                "id_album" => $id_album,
                "id_site" => $id_site,
                "name_album" => $name_album,
                "title" => $titleImg,
                "extension" => $image['ext'],
                "weight" => $image['size'],
                "image" => $filePath,
                "activity" => "on",
                "date_create" => $currentDateTime
            ]);
            $id_new_row_photo = $dbh->lastInsertId();

            $query_get_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE `id` = :id");
            $query_get_images->execute(["id" => $id_new_row_photo]);
            $getImages = $query_get_images->fetch(PDO::FETCH_OBJ);


            if ($query_get_images->rowCount() != 0) {
                $addedPhotos[] = $getImages;
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Ошибка при сохранении файла", JSON_UNESCAPED_UNICODE);
            return false;
        }
    }

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($addedPhotos, JSON_UNESCAPED_UNICODE);
}

// замена фотографии в записи
function photoReplacement() {
    global $POST, $dbh, $images, $titleAlbum, $currentDateTime;

    $id_image = $POST['id_image'];

    $query_get_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE `id` = :id");
    $query_get_images->execute(["id" => $id_image]);
    $getImages = $query_get_images->fetch(PDO::FETCH_OBJ);

    if ($query_get_images->rowCount() != 0) {
        $parsed_url = parse_url($getImages->image);
        $pathFile = $parsed_url['path'];
        $pathFile = ltrim($pathFile, '/');

        // удаляем файл на сервере
        $delete_file = deleteFile($pathFile);

        if ($delete_file == "false") {
            header("HTTP/1.1 400 Bad Request");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Ошибка при сохранении файла", JSON_UNESCAPED_UNICODE);
            return false;
        }
    }

    $webpImages = convertImagesToWebP($images);
    $replaceCount = 0;

    // сохраняем новое фото и редактируем запись
    foreach ($webpImages as &$image) {
        $saveImgPath = "api/media/" . $titleAlbum;
        $titleImg = $image['name'] . "." . $image['ext'];
        $saveImg = saveFile($image, $saveImgPath);
        $filePath = "https://otal-estate.ru/" . $saveImgPath . "/" . $titleImg;

        if ($saveImg != "false") {

            // обновляем запись (фото) в таблице "project_photos"
            $query_add_image = $dbh->prepare("UPDATE `project_gallery_image` SET
                `title` = :title,
                `extension` = :extension,
                `weight` = :weight,
                `image` = :image,
                `date_create` = :date_create
                WHERE `id` = :id
            ");
            $query_add_image->execute([
                "id" => $id_image,
                "title" => $titleImg,
                "extension" => $image['ext'],
                "weight" => $image['size'],
                "image" => $filePath,
                "date_create" => $currentDateTime
            ]);

            if ($query_add_image->rowCount() != 0) {
                $replaceCount++;
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Ошибка при сохранении файла", JSON_UNESCAPED_UNICODE);
            return false;
        }
    }

    if ($replaceCount == count($webpImages)) {
        $query_get_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE `id` = :id");
        $query_get_images->execute(["id" => $id_image]);
        $getImages = $query_get_images->fetch(PDO::FETCH_OBJ);

        if ($query_get_images->rowCount() > 0) {
            header("HTTP/1.1 200 OK");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($getImages, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 400 Bad Request");
            header('Content-Type: application/json; charset=UTF-8');
        }
    }
}


// Удаление
if ($method === "DELETE") {
    $id_image = $POST['id_image'] ?? $_GET['id_image'];

    $query_get_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE `id` = :id");
    $query_get_images->execute(["id" => $id_image]);
    $getImages = $query_get_images->fetch(PDO::FETCH_OBJ);


    $parsed_url = parse_url($getImages->image);
    $pathFile = $parsed_url['path'];
    $pathFile = ltrim($pathFile, '/');

    // удаляем файл на сервере
    $delete_file = deleteFile($pathFile);

    if ($delete_file == "false") return false;

    $query_delete = $dbh->prepare("DELETE FROM `project_gallery_image` WHERE `id` = :id");
    $query_delete->execute(["id" => $getImages->id]);

    if ($query_delete->rowCount() > 0) {
        header("HTTP/1.1 200 DELETE");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Запись успешно удалена", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при удалении записи", JSON_UNESCAPED_UNICODE);
    }
}