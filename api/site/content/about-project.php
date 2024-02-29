<?php

function aboutProject($id_site) {
    global $dbh;
    $about = new stdClass();

    $query_get_about = $dbh->prepare("SELECT * FROM `site_desc_about` WHERE `id_site` = :id_site");
    $query_get_about->execute(["id_site" => $id_site]);

    if ($query_get_about->rowCount() > 0) {
        $aboutProject = $query_get_about->fetch(PDO::FETCH_OBJ);

        // собираем дату
        $about->about->title = $aboutProject["title"];
        $about->about->desc = $aboutProject["desc"];
    }

    $query_get_territory = $dbh->prepare("SELECT * FROM `site_desc_territory` WHERE `id_site` = :id_site");
    $query_get_territory->execute(["id_site" => $id_site]);

    if ($query_get_territory->rowCount() > 0) {
        $descTerritory = $query_get_territory->fetch(PDO::FETCH_OBJ);

        // собираем дату
        $about->territory->title = $descTerritory["title"];
        $about->territory->desc = $descTerritory["desc"];
    }


    if ($query_get_about->rowCount() > 0 && $query_get_territory->rowCount() > 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($about, JSON_UNESCAPED_UNICODE);
    }
}