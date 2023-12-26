<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_image = $POST['id_image'];
$changeActivity = ($POST['activity'] == "true") ? "on" : "off";
$currentDateTime = date('Y-m-d H:i:s');

// изменяем активность
if ($method === "POST") {

    $query_get_images = $dbh->prepare("SELECT * FROM `project_gallery_image` WHERE `id` = :id");
    $query_get_images->execute(["id" => $id_image]);
    $getImages = $query_get_images->fetch(PDO::FETCH_OBJ);

    if ($query_get_images->rowCount() > 0) {
        $query_updateActivity = $dbh->prepare("UPDATE `project_gallery_image` SET `activity` = :activity WHERE `id` = :id");
        $query_updateActivity->execute(["activity" => $changeActivity, "id" => $getImages->id]);

        if ($query_get_images->rowCount() > 0) {
            header("HTTP/1.1 200 UPDATE");
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(["activity"=>$changeActivity], JSON_UNESCAPED_UNICODE);
        }
    }
}