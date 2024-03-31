<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

if ($method === "DELETE") {
    $id_site = $_GET['id_site'];
    $id_source = $_GET['id_source'];

    $query_delete = $dbh->prepare("DELETE FROM `site_orders_source_send` WHERE `id_site` = :id_site AND `id` = :id");
    $query_delete->execute(["id" => $id_source, "id_site" => $id_site]);

    if ($query_delete->rowCount() > 0) {
        header("HTTP/1.1 200 Delete");
        echo json_encode("Запись была успешно удалена", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode("Ошибка при удалении", JSON_UNESCAPED_UNICODE);
    }
}

$dbh = null;
die();