<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$siteID = $POST['id_site'] ?? $_GET['id_site'];

// Получение
if ($method === "GET") {
    $query_get = $dbh->prepare("SELECT * FROM `project_location` WHERE `id_site` = :id_site LIMIT 1");
    $query_get->execute(["id_site" => $siteID]);
    $location = $query_get->fetch(PDO::FETCH_OBJ);

    if ($query_get->rowCount() != 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($location, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 404 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
    }
}

// Запись
if ($method === "POST") {

}