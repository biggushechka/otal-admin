<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

global $dbh;

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$domain = $POST['domain'];

if ($method === "POST") {
    if ($domain == "") return false;

    $generalInfo = new stdClass();

    $query_get_site = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain");
    $query_get_site->execute(["domain" => $domain]);
    $get_site = $query_get_site->fetch(PDO::FETCH_OBJ);
    $id_site = $get_site->id;

    // собираем дату
    $generalInfo->id_site = $id_site;
    $generalInfo->domain = $get_site->domain;
    $generalInfo->activity = $get_site->activity;
    // end - собираем дату


    if ($query_get_site->rowCount() > 0) {

        // получаем общую информацию по проекту и контакты
        $query_get_general = $dbh->prepare("SELECT * FROM `project_general` WHERE `id_site` = :id_site");
        $query_get_general->execute(["id_site" => $id_site]);
        $data_general = $query_get_general->fetch(PDO::FETCH_OBJ);

        if ($query_get_general->rowCount() > 0) {
            unset($data_general->id);
            unset($data_general->id_site);
            unset($data_general->preview_photo);
            unset($data_general->date_update);

            $generalInfo->title = $data_general->title_project;
            $generalInfo->contacts = $data_general;
        }

        // получаем список параметров по проекту
        $query_get_parameters = $dbh->prepare("SELECT * FROM `project_parameters` WHERE `id_site` = :id_site");
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