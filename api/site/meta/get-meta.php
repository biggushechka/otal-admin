<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$id_site = $_GET['id_site'];
$type = $_GET['type'];
$currentDateTime = date('Y-m-d H:i:s');

// Получение
if ($method === "GET") {

    if ($type === "title") {
        $query_get_title = $dbh->prepare("SELECT * FROM `site_meta` WHERE `id_site` = :id_site AND `title` = :title");
        $query_get_title->execute(["id_site" => $id_site, "title" => "title"]);

        if ($query_get_title->rowCount() > 0) {
            if ($query_get_title->rowCount() > 0) {
                $meta = $query_get_title->fetchAll(PDO::FETCH_ASSOC);

                header("HTTP/1.1 200 OK");
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode($meta, JSON_UNESCAPED_UNICODE);
            } else {
                header("HTTP/1.1 204 Not Found");
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
            }
        } else {

            $query_creat = $dbh->prepare("INSERT INTO `site_meta` SET `id_site` = :id_site, `title` = :title, `activity` = :activity, `date_create` = :date_create");
            $query_creat->execute([
                "id_site" => $id_site,
                "title" => "title",
                "activity" => "on",
                "date_create" => $currentDateTime
            ]);

            $query_get_title = $dbh->prepare("SELECT * FROM `site_meta` WHERE `id_site` = :id_site AND `title` = :title");
            $query_get_title->execute(["id_site" => $id_site, "title" => "title"]);

            if ($query_get_title->rowCount() > 0) {
                $meta = $query_get_title->fetchAll(PDO::FETCH_ASSOC);

                header("HTTP/1.1 200 OK");
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode($meta, JSON_UNESCAPED_UNICODE);
            } else {
                header("HTTP/1.1 204 Not Found");
                header('Content-Type: application/json; charset=UTF-8');
                echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
            }
        }

    } else {
        $query_get_mata = $dbh->prepare("SELECT * FROM `site_meta` WHERE `id_site` = :id_site AND title <> 'title'");
        $query_get_mata->execute(["id_site" => $id_site]);

        if ($query_get_mata->rowCount() > 0) {
            $meta = $query_get_mata->fetchAll(PDO::FETCH_ASSOC);

            header("HTTP/1.1 200 OK");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($meta, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 204 Not Found");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
        }
    }
}