<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
require_once "$rootPath/api/config/db_connect.php";

getGallery($_GET["id_site"]);

function getGallery($id_site) {
    global $dbh;

    $query_get = $dbh->prepare("SELECT * FROM `site_gallery_album` WHERE `id_site` = :id_site AND `activity` = :activity AND title <> 'Основной альбом'");
    $query_get->execute(["id_site" => $id_site, "activity" => "on"]);

    if ($query_get->rowCount() > 0) {
        $getAlbums = $query_get->fetchAll(PDO::FETCH_ASSOC);

        $gallery = new stdClass();

        foreach ($getAlbums as $album) {
            $title_album = $album["title"];
            $id_album = $album["id"];

//            $gallery->$id_album->title = $title_album;
//            $gallery->$id_album->photo = [];
        }

//        foreach ($idAlbums as $itemAlbum) {
//            $query_get_photo = $dbh->prepare("SELECT * FROM `site_gallery_image` WHERE `id_site` = :id_site AND `activity` = :activity AND title <> 'Основной альбом'");
//            $query_get->execute(["id_site" => $id_site, "activity" => "on"]);
//        }

        echo json_encode($gallery, JSON_UNESCAPED_UNICODE);
    }
}