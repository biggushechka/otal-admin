<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'];
$source = $POST['source'];
$email = $POST['email'];
$tg_chad_id = $POST['telegram'];
$currentDateTime = date('Y-m-d H:i:s');

if ($method === "POST") {

    if ($source === "email") {
        $query_add_row = $dbh->prepare("INSERT INTO `site_orders_source_email` SET
            `id_site` = :id_site,
            `email` = :email,
            `date_create` = :date_create
        ");

        $query_add_row->execute([
            "id_site" => $id_site,
            "email" => $email,
            "date_create" => $currentDateTime
        ]);

        if ($query_add_row->rowCount() > 0) {
            $lastInsertIdSource = $dbh->lastInsertId();
            $query_get_meta = $dbh->prepare("SELECT * FROM `site_orders_source_email` WHERE `id` = :id");
            $query_get_meta->execute(["id" => $lastInsertIdSource]);
            $newSource = $query_get_meta->fetch(PDO::FETCH_OBJ);

            header("HTTP/1.1 200 ADDED");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($newSource, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 400 Bad request");
            echo json_encode("Ошибка при добавлении", JSON_UNESCAPED_UNICODE);
        }
    } else if ($source === "telegram") {
        $query_add_row = $dbh->prepare("INSERT INTO `site_orders_source_telegram` SET
            `id_site` = :id_site,
            `tg_chad_id` = :tg_chad_id,
            `date_create` = :date_create
        ");

        $query_add_row->execute([
            "id_site" => $id_site,
            "tg_chad_id" => $tg_chad_id,
            "date_create" => $currentDateTime
        ]);

        if ($query_add_row->rowCount() > 0) {
            $lastInsertIdSource = $dbh->lastInsertId();
            $query_get_meta = $dbh->prepare("SELECT * FROM `site_orders_source_telegram` WHERE `id` = :id");
            $query_get_meta->execute(["id" => $lastInsertIdSource]);
            $newSource = $query_get_meta->fetch(PDO::FETCH_OBJ);

            header("HTTP/1.1 200 ADDED");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($newSource, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 400 Bad request");
            echo json_encode("Ошибка при добавлении", JSON_UNESCAPED_UNICODE);
        }
    }
}

$dbh = null;
die();