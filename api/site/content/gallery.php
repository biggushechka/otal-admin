<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

global $dbh;

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['album'];
$album = $POST['album'];

if ($method === "POST") {
    $id_site = 0;

    if ($id_site == "" || $album == "") {
        return false;
    }

    if ($album === "main") {
        $query_get_album = $dbh->prepare("SELECT * FROM `project_gallery_album` WHERE `id_site` = :id_site AND `title` = :title");
        $query_get_album->execute(["id_site" => $id_site, "title" => "Основной альбом"]);

        if ($query_get_album->rowCount() > 0) {
            $get_album = $query_get_album->fetch(PDO::FETCH_OBJ);
            $id_album = $get_album->id;

            $query_get_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE `id_site` = :id_site AND `id_album` = :id_album");
            $query_get_images->execute(["id_site" => $id_site, "id_album" => $id_album]);

            if ($query_get_images->rowCount() > 0) {
                $data_images = $query_get_images->fetch(PDO::FETCH_OBJ);

                header("HTTP/1.1 200 OK");
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode($data_images, JSON_UNESCAPED_UNICODE);
            } else {
                header("HTTP/1.1 204 Not Found");
                header('Content-Type: application/json; charset=UTF-8');
            }
        }
    }

    if ($album === "all") {

    }
}
