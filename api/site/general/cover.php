<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';
require_once $rootPath . '/backend/functions.php';

$postdata = file_get_contents("php://input");
$data = json_decode($postdata, true);

$id_site = $data["id_site"] ?? $_GET["id_site"];
$cover = $data["cover"] ?? $_GET["cover"];
$currentDateTime = date('Y-m-d H:i:s');

// добавление
if ($method === "POST") {
    $webpImages = convertImagesToWebP($cover);
    $file = $webpImages[0];
    $filePath = "https://otal-estate.ru/api/media/cover/" . $file['name'] . "." . $file['ext'];

    // проверяем, есть в картинка в таблице "project_photos"
    $query_find_cover = $dbh->prepare("SELECT * FROM `project_photos` WHERE id_site = :id_site AND name_album = :name_album");
    $query_find_cover->execute([
        "id_site" => $id_site,
        "name_album" => "cover_project"
    ]);
    $photo = $query_find_cover->fetch();

    if ($query_find_cover->rowCount() == 0) {
        // создаем альбом
        $query_create_album = $dbh->prepare("INSERT INTO `project_albums` SET `id_site` = :id_site, `title` = :title, `date_create` = :date_create, `activity` = :activity");
        $query_create_album->execute([
            "id_site" => $id_site,
            "title" => "cover_project",
            "date_create" => $currentDateTime,
            "activity" => "on"
        ]);
        $album_id = $dbh->lastInsertId();

        // добавляем фото в альбом
        if ($query_create_album->rowCount() > 0) {

            $saveFileToFolder = saveFile($file, "api/media/cover");
            if ($saveFileToFolder = 0) return false;

            $query_add_cover = $dbh->prepare("INSERT INTO `project_photos` SET `id_album` = :id_album, name_album = :name_album, `id_site` = :id_site, `title` = :title, `extension` = :extension, `image` = :image, `activity` = :activity, `date_create` = :date_create");
            $query_add_cover->execute([
                "id_album" => $album_id,
                "name_album" => "cover_project",
                "id_site" => $id_site,
                "title" => $file['name'] . "." . $file['ext'],
                "extension" => $file['ext'],
                "image" => $filePath,
                "activity" => "on",
                "date_create" => $currentDateTime
            ]);

            $query_update_cover = $dbh->prepare("UPDATE `project_general` SET `preview_photo` = :preview_photo WHERE `id_site` = :id_site");
            $query_update_cover->execute([
                "preview_photo" => $filePath,
                "id_site" => $id_site
            ]);

            header("HTTP/1.1 200 OK");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($filePath, JSON_UNESCAPED_UNICODE);
        } else {
            echo "not_add_cover";
        }
    } else {
        $saveFileToFolder = saveFile($file, "api/media/cover");
        if ($saveFileToFolder = 0) return false;

        // обновляем картинку в таблице "project_photos"
        $query_add_cover = $dbh->prepare("UPDATE `project_photos` SET `title` = :title, `extension` = :extension, `image` = :image, `date_create` = :date_create WHERE id = :id");
        $query_add_cover->execute([
            "id" => $photo['id'],
            "title" => $file['name'] . "." . $file['ext'],
            "extension" => $file['ext'],
            "image" => $filePath,
            "date_create" => $currentDateTime
        ]);

        $query_update_cover = $dbh->prepare("UPDATE `project_general` SET `preview_photo` = :preview_photo WHERE `id_site` = :id_site");
        $query_update_cover->execute([
            "preview_photo" => $filePath,
            "id_site" => $id_site
        ]);
    }
}