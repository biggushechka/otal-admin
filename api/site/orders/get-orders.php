<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

// Получение
if ($method === "GET") {
    $query_get_mata = $dbh->prepare("SELECT * FROM `project_orders`");
    $query_get_mata->execute();

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