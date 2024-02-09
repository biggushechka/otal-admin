<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

// Получение
if ($method === "GET") {
    $query_get_banks = $dbh->prepare("SELECT * FROM `banks`");
    $query_get_banks->execute();

    if ($query_get_banks->rowCount() > 0) {
        $data = $query_get_banks->fetchAll(PDO::FETCH_ASSOC);

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
    }
}