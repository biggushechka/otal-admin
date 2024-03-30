<?php

function getGallery($id_site) {
    global $dbh;
    $gallery = new stdClass();

    $query_get = $dbh->prepare("SELECT * FROM `site_gallery_album` WHERE `id_site` = :id_site AND `activity` = :activity AND title <> 'Основной альбом'");
    $query_get->execute(["id_site" => $id_site, "activity" => "on"]);

    if ($query_get->rowCount() > 0) {
        $getAlbums = $query_get->fetchAll(PDO::FETCH_ASSOC);

        foreach ($getAlbums as $album) {
            $title_album = $album["title"];
            $id_album = $album["id"];

            $gallery->{$id_album} = new stdClass();
            $gallery->{$id_album}->title = $title_album;
            $gallery->{$id_album}->photo = [];
        }

        foreach ($gallery as $id_album => $itemAlbum) {
            $query_get_photo = $dbh->prepare("SELECT `id_album`, `image` FROM `site_gallery_image` WHERE `id_site` = :id_site AND `activity` = :activity AND `id_album` = $id_album");
            $query_get_photo->execute(["id_site" => $id_site, "activity" => "on"]);

            if ($query_get_photo->rowCount() > 0) {
                $getPhotos = $query_get_photo->fetchAll(PDO::FETCH_ASSOC);

                foreach ($getPhotos as $image) {
                    $gallery->{$id_album}->photo[] = $image["image"];
                }
            }
        }

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($gallery, JSON_UNESCAPED_UNICODE);
    }
}