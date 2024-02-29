<?php

function aboutProject($id_site) {
    global $dbh;
    $about = new stdClass();

    $query_get_about = $dbh->prepare("SELECT `title`, `desc` FROM `site_desc_about` WHERE `id_site` = :id_site");
    $query_get_about->execute(["id_site" => $id_site]);

    if ($query_get_about->rowCount() > 0) {
        $aboutProject = $query_get_about->fetch(PDO::FETCH_OBJ);

        // собираем дату
        $about->about = $aboutProject;
    }

    $query_get_territory = $dbh->prepare("SELECT `title`, `desc` FROM `site_desc_territory` WHERE `id_site` = :id_site");
    $query_get_territory->execute(["id_site" => $id_site]);

    if ($query_get_territory->rowCount() > 0) {
        $descTerritory = $query_get_territory->fetch(PDO::FETCH_OBJ);

        // собираем дату
        $about->territory = $descTerritory;
    }


    if ($query_get_about->rowCount() > 0 && $query_get_territory->rowCount() > 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($about, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка", JSON_UNESCAPED_UNICODE);
    }

    $dbh = null;
    die();
}