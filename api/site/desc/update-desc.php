<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_row = $POST['id'];
$title = $POST['title'];
$desc = $POST['desc'];
$target = $POST['target'];
$currentDateTime = date('Y-m-d H:i:s');
$db_table = "";

if ($target === "about") {
    $db_table = "site_desc_about";
} else if ($target === "territory") {
    $db_table = "site_desc_territory";
}

$query_update = $dbh->prepare("UPDATE `$db_table` SET
        `title` = :title,
        `desc` = :desc,
        `date_update` = :date_update
        WHERE `id` = :id
    ");

$query_update->execute([
    "id" => $id_row,
    "title" => $title,
    "desc" => $desc,
    "date_update" => $currentDateTime
]);

if ($query_update->rowCount() > 0) {
    $query_get_desc = $dbh->prepare("SELECT * FROM `$db_table` WHERE `id` = :id");
    $query_get_desc->execute(["id" => $id_row]);
    $update_desc = $query_get_desc->fetch(PDO::FETCH_OBJ);

    header("HTTP/1.1 200 UPDATE");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($update_desc, JSON_UNESCAPED_UNICODE);
} else {
    header("HTTP/1.1 400 Bad Request");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode("Ошибка при добавлении записи", JSON_UNESCAPED_UNICODE);
}

$dbh = null;
die();