<?php

function getInfrastructure($id_site) {
    global $dbh;

    $query_get = $dbh->prepare("SELECT `title`, `description`, `photo` FROM `site_infrastructure` WHERE `id_site` = :id_site AND `activity` = :activity");
    $query_get->execute(["id_site" => $id_site, "activity" => "on"]);

    if ($query_get->rowCount() > 0) {
        $infrastructure = $query_get->fetchAll(PDO::FETCH_ASSOC);

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($infrastructure, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
    }
}