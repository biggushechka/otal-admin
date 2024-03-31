<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$id_site = $_GET['id_site'];
$source = $_GET['source'];

// Получение
if ($method === "GET") {

    if ($source === "email") {
        $query_get_row = $dbh->prepare("SELECT `id`, `email` FROM `site_orders_source_send` WHERE `id_site` = :id_site");
        $query_get_row->execute(["id_site" => $id_site]);

        if ($query_get_row->rowCount() > 0) {
            $email = $query_get_row->fetchAll(PDO::FETCH_ASSOC);
            header("HTTP/1.1 200 OK");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($email, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 404 NF");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode("E-mail еще нет", JSON_UNESCAPED_UNICODE);
        }
    }
}


$dbh = null;
die();