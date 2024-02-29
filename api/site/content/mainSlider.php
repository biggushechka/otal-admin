<?php

function getMainSlider($id_site) {
    global $dbh;
    $query_get_album = $dbh->prepare("SELECT * FROM `site_gallery_album` WHERE `id_site` = :id_site AND `title` = :title LIMIT 1");
    $query_get_album->execute(["id_site" => $id_site, "title" => "Основной альбом"]);

    if ($query_get_album->rowCount() > 0) {
        $get_album = $query_get_album->fetch(PDO::FETCH_OBJ);
        $id_album = $get_album->id;

        $query_get_images = $dbh->prepare("SELECT * FROM `site_gallery_image` WHERE `id_album` = :id_album AND `id_site` = :id_site AND `activity` = :activity");
        $query_get_images->execute([
            "id_album" => $id_album,
            "id_site" => $id_site,
            "activity" => "on"
        ]);

        if ($query_get_images->rowCount() > 0) {
            $data_images = $query_get_images->fetchAll(PDO::FETCH_ASSOC);

            header("HTTP/1.1 200 OK");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($data_images, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 204 Not Found");
        }
    } else {
        header("HTTP/1.1 404 Not Found");
    }
}