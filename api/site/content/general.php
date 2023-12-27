<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';
require_once $rootPath . '/backend/functions.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id = $POST['id'] ?? $_GET['id'];

if ($method === "GET") {
    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode("YES", JSON_UNESCAPED_UNICODE);
}