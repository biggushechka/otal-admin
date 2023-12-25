<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';
require_once $rootPath . '/backend/functions.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id = $POST['id'] ?? $_GET['id'];
$id_site = $POST['id_site'] ?? $_GET['id_site'];
$photos = $POST['photo'] ?? $_GET['photo'];
$title = $POST['title'] ?? $_GET['title'];
$description = $POST['description'] ?? $_GET['description'];
$currentDateTime = date('Y-m-d H:i:s');
$titleAlbum = "advantages";

// Получение
if ($method === "GET") {
    $query_get_row = $dbh->prepare("SELECT * FROM `project_advantages` WHERE `id_site` = :id_site");
    $query_get_row->execute(["id_site" => $id_site]);
    $advantages = $query_get_row->fetchAll(PDO::FETCH_ASSOC);

    if ($query_get_row->rowCount() != 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($advantages, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 404 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Данных нет", JSON_UNESCAPED_UNICODE);
    }
}

// отправить
if ($method === "POST") {
    $album_id = "";

    if ($id != "") {
        updateRow();
        return false;
    }

    // проверяем, есть ли альбом для фотографий
    $query_find_album = $dbh->prepare("SELECT * FROM `project_albums` WHERE id_site = :id_site AND title = :title");
    $query_find_album->execute([
        "id_site" => $id_site,
        "title" => $titleAlbum
    ]);
    $album = $query_find_album->fetch(PDO::FETCH_ASSOC);
    $album_id = $album['id'];

    // если альбома "advantages" нет, то создаем его
    if ($query_find_album->rowCount() == 0) {
        $query_create_album = $dbh->prepare("INSERT INTO `project_albums` SET `id_site` = :id_site, `title` = :title, `date_create` = :date_create, `activity` = :activity");
        $query_create_album->execute([
            "id_site" => $id_site,
            "title" => $titleAlbum,
            "date_create" => $currentDateTime,
            "activity" => "on"
        ]);
        $album_id = $dbh->lastInsertId();

        if ($query_create_album->rowCount() == 0) return false;
    }

    // ковертируем фото в webp
    $webpImages = convertImagesToWebP($photos);

    // добавляем фото в альбом
    foreach ($webpImages as &$image) {
        $saveImgPath = "api/media/" . $titleAlbum;
        $titleImg = $image['name'] . "." . $image['ext'];
        $saveImg = saveFile($image, $saveImgPath);
        $filePath = "https://otal-estate.ru/" . $saveImgPath . "/" . $titleImg;

        if ($saveImg != "false") {
            // добавляем фото в таблицу "project_photos"
            $query_add_cover = $dbh->prepare("INSERT INTO `project_photos` SET `id_album` = :id_album, name_album = :name_album, `id_site` = :id_site, `title` = :title, `extension` = :extension, `weight` = :weight, `image` = :image, `activity` = :activity, `date_create` = :date_create");
            $query_add_cover->execute([
                "id_album" => $album_id,
                "name_album" => $titleAlbum,
                "id_site" => $id_site,
                "title" => $titleImg,
                "extension" => $image['ext'],
                "weight" => $image['size'],
                "image" => $filePath,
                "activity" => "on",
                "date_create" => $currentDateTime
            ]);

            // добавляем запись в таблицу "project_advantages"
            $query_add_adv = $dbh->prepare("INSERT INTO `project_advantages` SET
                `id_site` = :id_site,
                `photo` = :photo,
                `title` = :title,
                `description` = :description,
                `activity` = :activity,
                `date_create` = :date_create
             ");

            $query_add_adv->execute([
                "id_site" => $id_site,
                "photo" => $filePath,
                "title" => $title,
                "description" => $description,
                "activity" => "on",
                "date_create" => $currentDateTime,
            ]);
            $new_row_id = $dbh->lastInsertId();

            if ($query_add_adv->rowCount() != 0) {
                // получаем данные по добавленной записи
                $query_get_new_row = $dbh->prepare("SELECT * FROM `project_advantages` WHERE id = :id");
                $query_get_new_row->execute(["id" => $new_row_id]);
                $adv = $query_get_new_row->fetch(PDO::FETCH_OBJ);

                header("HTTP/1.1 200 OK");
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode($adv, JSON_UNESCAPED_UNICODE);
            } else {
                header("HTTP/1.1 409 Conflict");
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode("Ошибка при добавлении записи", JSON_UNESCAPED_UNICODE);
            }
        } else {
            header("HTTP/1.1 409 Conflict");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Ошибка при сохранении файла", JSON_UNESCAPED_UNICODE);
            return false;
        }
    }
}

// обновление записи
function updateRow() {
    global $dbh, $id, $id_site, $photos, $title, $description, $currentDateTime, $titleAlbum;
    $album_id = "";

    $query = $dbh->prepare("UPDATE `project_advantages` SET  
        `title` = :title, 
        `description` = :description, 
        `date_create` = :date_create 
    WHERE `id` = :id");

    $query->execute([
        "id" => $id,
        "title" => $title,
        "description" => $description,
        "date_create" => $currentDateTime
    ]);



    if ($photos != "") {
        // получаем все данные "преимущества"
        $query_get_row = $dbh->prepare("SELECT * FROM `project_advantages` WHERE id = :id");
        $query_get_row->execute(["id" => $id]);
        $row = $query_get_row->fetch(PDO::FETCH_ASSOC);

        // получаем фотографию
        $query_find_photo = $dbh->prepare("SELECT * FROM `project_photos` WHERE id_site = :id_site AND image = :image");
        $query_find_photo->execute([
            "id_site" => $id_site,
            "image" => $row['photo']
        ]);
        $find_photo = $query_find_photo->fetch(PDO::FETCH_ASSOC);
        $find_photo_idAlbum = $find_photo["id_album"];

        $parsed_url = parse_url($find_photo["image"]);
        $pathFile = $parsed_url['path'];
        $pathFile = ltrim($pathFile, '/');

        // удаляем файл на сервере
        $delete_file = deleteFile($pathFile);

        if ($delete_file == "false") return false;

        // удаляем фото из таблицы "project_photos"
        $query_delete_photo = $dbh->prepare("DELETE FROM `project_photos` WHERE `id` = :id");
        $query_delete_photo->execute(["id" => $find_photo["id"]]);


        // ковертируем фото в webp
        $webpImages = convertImagesToWebP($photos);

        // добавляем фото в альбом
        foreach ($webpImages as &$image) {
            $saveImgPath = "api/media/" . $titleAlbum;
            $titleImg = $image['name'] . "." . $image['ext'];
            $saveImg = saveFile($image, $saveImgPath);
            $filePath = "https://otal-estate.ru/" . $saveImgPath . "/" . $titleImg;

            if ($saveImg != "false") {
                // добавляем фото в таблицу "project_photos"
                $query_add_cover = $dbh->prepare("INSERT INTO `project_photos` SET `id_album` = :id_album, name_album = :name_album, `id_site` = :id_site, `title` = :title, `extension` = :extension, `weight` = :weight, `image` = :image, `activity` = :activity, `date_create` = :date_create");
                $query_add_cover->execute([
                    "id_album" => $find_photo_idAlbum,
                    "name_album" => $titleAlbum,
                    "id_site" => $id_site,
                    "title" => $titleImg,
                    "extension" => $image['ext'],
                    "weight" => $image['size'],
                    "image" => $filePath,
                    "activity" => "on",
                    "date_create" => $currentDateTime
                ]);

                // добавляем запись в таблицу "project_advantages"
                $query_uppdate_row = $dbh->prepare("UPDATE `project_advantages` SET `photo` = :photo WHERE `id` = :id");
                $query_uppdate_row->execute(["id" => $id, "photo" => $filePath]);

                if ($query_uppdate_row->rowCount() > 0) {
                    $query_get_update_row = $dbh->prepare("SELECT * FROM `project_advantages` WHERE id = :id");
                    $query_get_update_row->execute(["id" => $id]);
                    $adv = $query_get_update_row->fetch(PDO::FETCH_OBJ);

                    header("HTTP/1.1 200 OK");
                    header('Content-Type: application/json; charset=UTF-8');
                    echo json_encode($adv, JSON_UNESCAPED_UNICODE);
                } else {
                    header("HTTP/1.1 409 Conflict");
                    header('Content-Type: application/json; charset=UTF-8');
                    echo json_encode("Ошибка при обновлении", JSON_UNESCAPED_UNICODE);
                }

            } else {
                header("HTTP/1.1 409 Conflict");
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode("Ошибка при сохранении файла", JSON_UNESCAPED_UNICODE);
                return false;
            }
        }
    }
}

// удаление сайта
if ($method === "DELETE") {
    $photo = $POST['photo'] ?? $_GET['photo'];
    $parsed_url = parse_url($photo);
    $pathFile = $parsed_url['path'];
    $pathFile = ltrim($pathFile, '/');

    // удаляем файл на сервере
    $delete_file = deleteFile($pathFile);

    if ($delete_file == "false") return false;

    // удаляем запись из таблицы "project_advantages"
    $query_delete_adv = $dbh->prepare("DELETE FROM `project_advantages` WHERE `id` = :id");
    $query_delete_adv->execute(["id" => $id]);

    // удаляем фото из таблицы "project_photos"
    $query_delete_photo = $dbh->prepare("DELETE FROM `project_photos` WHERE `image` = :image");
    $query_delete_photo->execute(["image" => $photo]);

    if ($query_delete_adv->rowCount() > 0 && $query_delete_photo->rowCount() > 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Запись успешно удалена", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 409 Conflict");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при удалении записи", JSON_UNESCAPED_UNICODE);
    }
}