<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$postdata = file_get_contents("php://input");
$data = json_decode($postdata, true);

$id_site = $data["id_site"] ?? $_GET["id_site"];
$cover = $data["cover"] ?? $_GET["cover"];
$currentDateTime = date('Y-m-d H:i:s');

// добавление
if ($method === "POST") {
    print_r($_POST);
}