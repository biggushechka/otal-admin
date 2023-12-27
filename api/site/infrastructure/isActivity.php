<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_adv = $POST['id_adv'];
$changeActivity = ($POST['activity'] == "true") ? "on" : "off";
$currentDateTime = date('Y-m-d H:i:s');

// изменяем активность
if ($method === "POST") {
    $query_updateActivity = $dbh->prepare("UPDATE `project_Infrastructure` SET `activity` = :activity WHERE `id` = :id");
    $query_updateActivity->execute(["activity" => $changeActivity, "id" => $id_adv]);

    if ($query_updateActivity->rowCount() > 0) {
        header("HTTP/1.1 200 UPDATE");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(["activity"=>$changeActivity], JSON_UNESCAPED_UNICODE);
    }
}