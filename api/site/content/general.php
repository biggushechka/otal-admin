<?php

function getGeneral($id_site) {
    global $dbh;
    $generalInfo = new stdClass();

    $query_get_site = $dbh->prepare("SELECT * FROM `my_sites` WHERE `id` = :id");
    $query_get_site->execute(["id" => $id_site]);
    $get_site = $query_get_site->fetch(PDO::FETCH_OBJ);

    // собираем дату
    $generalInfo->id_site = $id_site;
    $generalInfo->domain = $get_site->domain;
    $generalInfo->activity = $get_site->activity;
    // end - собираем дату

    if ($query_get_site->rowCount() > 0) {

        // получаем общую информацию по проекту и контакты
        $query_get_general = $dbh->prepare("SELECT * FROM `site_general` WHERE `id_site` = :id_site");
        $query_get_general->execute(["id_site" => $id_site]);
        $data_general = $query_get_general->fetch(PDO::FETCH_OBJ);

        if ($query_get_general->rowCount() > 0) {
            unset($data_general->id);
            unset($data_general->id_site);
            unset($data_general->preview_photo);
            unset($data_general->date_update);

            $generalInfo->title = $data_general->title_project;
            $generalInfo->slogan = $data_general->slogan;
            $generalInfo->contacts = $data_general;
        }

        // получаем список параметров по проекту
        $query_get_parameters = $dbh->prepare("SELECT * FROM `site_parameters` WHERE `id_site` = :id_site");
        $query_get_parameters->execute(["id_site" => $id_site]);
        $data_parameters = $query_get_parameters->fetch(PDO::FETCH_OBJ);

        if ($query_get_parameters->rowCount() > 0) {
            unset($data_parameters->id);
            unset($data_parameters->id_site);

            $generalInfo->parameters = $data_parameters;
        }

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($generalInfo, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 404 Not Found");
        echo json_encode("Site not found", JSON_UNESCAPED_UNICODE);
    }
}