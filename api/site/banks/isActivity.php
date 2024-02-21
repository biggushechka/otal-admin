<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$postdata = file_get_contents("php://input");
$POST = json_decode($postdata, true);

$id_site = $POST['id_site'];
$id_bank = $POST['id_bank'];
$activity = ($POST['activity'] == "true") ? "on" : "off";
$currentDateTime = date('Y-m-d H:i:s');

// изменяем активность сайта
if ($method === "POST") {
    $query_updateActivity = $dbh->prepare("UPDATE `site_banks` SET `activity` = :activity WHERE `id` = :id");
    $query_updateActivity->execute(["activity" => $activity, "id" => $id_bank]);

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(["activity" => $activity], JSON_UNESCAPED_UNICODE);
}