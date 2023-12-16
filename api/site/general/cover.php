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
    $filePath = "";

    $query_find_cover = $dbh->prepare("SELECT * FROM `project_general`  WHERE `id_site` = :id_site LIMIT 1");
    $query_find_cover->execute(["id_site" => $id_site]);
    $findCover = $query_find_cover->fetch(PDO::FETCH_OBJ);

    if ($findCover->preview_photo == "") {
        $webpImages = convertImagesToWebP($cover);
        $file = $webpImages[0];

        $filePath = "https://otal-estate.ru/api/media/cover/" . $file['name'] . "." . $file['ext'];
        $query_update_general = $dbh->prepare("UPDATE `project_general` SET `preview_photo` = :preview_photo WHERE `id_site` = :id_site");
        $query_update_general->execute(["preview_photo" => $filePath, "id_site" => $id_site]);
        saveFile($file, "api/media/cover");
    } else {
        echo "yest";
    }

//    header("HTTP/1.1 200 OK");
//    header('Content-Type: application/json; charset=UTF-8');
//    echo json_encode($filePath, JSON_UNESCAPED_UNICODE);
}