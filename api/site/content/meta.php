<?php

function meta($id_site) {
    global $dbh;

    $query_get_meta = $dbh->prepare("SELECT `title`, `code` FROM `site_meta` WHERE `id_site` = :id_site");
    $query_get_meta->execute(["id_site" => $id_site]);

    if ($query_get_meta->rowCount() > 0) {
        $meta = $query_get_meta->fetchAll(PDO::FETCH_ASSOC);

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($meta, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
    }
}