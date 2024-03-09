<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';
require_once $rootPath . '/backend/functions.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_row = $POST['id'];
$title = $POST['title'];
$desc = $POST['desc'];
$photo = $POST['photo'];
$target = $POST['target'];
$currentDateTime = date('Y-m-d H:i:s');
$db_table = "";

if ($target === "about") {
    $db_table = "site_desc_about";
} else if ($target === "territory") {
    $db_table = "site_desc_territory";
}

if ($photo != "") {
    $query_get_photo = $dbh->prepare("SELECT `photo` FROM `$db_table` WHERE `id` = :id LIMIT 1");
    $query_get_photo->execute(["id" => $id_row]);

    if ($query_get_photo->rowCount() > 0) {
        $getPhoto = $query_get_photo->fetch(PDO::FETCH_OBJ);
        $photoPath = $getPhoto->photo;

        if ($photoPath !== "") {
             $delete_file = deleteFile($photoPath); // удаляем файл на сервере
        }

        // ковертируем фото в webp
        $webpImages = convertImagesToWebP($photo);
        $photo = $webpImages[0];

        // добавляем фото в альбом
        $saveImgPath = "api/media/desc";
        $titleImg = $photo["name"] . "." . $photo["ext"];
        $saveImg = saveFile($photo, $saveImgPath);
        $filePath = "https://otal-estate.ru/" . $saveImgPath . "/" . $titleImg;

        if ($saveImg !== "false") {
            $query_updateActivity = $dbh->prepare("UPDATE `$db_table` SET `photo` = :photo WHERE `id` = :id");
            $query_updateActivity->execute(["photo" => $filePath, "id" => $id_row]);
        }
    }
}



$query_update = $dbh->prepare("UPDATE `$db_table` SET
    `title` = :title,
    `desc` = :desc,
    `date_update` = :date_update
    WHERE `id` = :id
");

$query_update->execute([
    "id" => $id_row,
    "title" => $title,
    "desc" => $desc,
    "date_update" => $currentDateTime
]);

if ($query_update->rowCount() > 0) {
    $query_get_desc = $dbh->prepare("SELECT * FROM `$db_table` WHERE `id` = :id");
    $query_get_desc->execute(["id" => $id_row]);
    $update_desc = $query_get_desc->fetch(PDO::FETCH_OBJ);

    header("HTTP/1.1 200 UPDATE");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($update_desc, JSON_UNESCAPED_UNICODE);
} else {
    header("HTTP/1.1 400 Bad Request");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode("Ошибка при добавлении записи", JSON_UNESCAPED_UNICODE);
}

$dbh = null;
die();