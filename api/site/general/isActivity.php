<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$id_site = $_GET['id_site'];
$changeActivity = ($_GET['activity'] == "true") ? "on" : "off";
$currentDateTime = date('Y-m-d H:i:s');

// изменяем активность сайта
if ($method === "UPDATE") {

    echo $_GET['activity'];

    $query_updateActivity = $dbh->prepare("UPDATE `my_sites` SET `activity` = :activity WHERE `id` = :id");
    $query_updateActivity->execute(["activity" => $changeActivity, "id" => $id_site]);

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["activity"=>$changeActivity], JSON_UNESCAPED_UNICODE);
}