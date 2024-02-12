<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

global $dbh;

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'];
$title = $POST['title'];
$code = $POST['code'];
$comment = $POST['comment'];
$currentDateTime = date('Y-m-d H:i:s');

// отправить
if ($method === "POST") {
    $query_add_meta = $dbh->prepare("INSERT INTO `project_meta` SET
        `id_site` = :id_site,
        `title` = :title,
        `code` = :code,
        `comment` = :comment,
        `activity` = :activity,
        `date_create` = :date_create
    ");

    $query_add_meta->execute([
        "id_site" => $id_site,
        "title" => $title,
        "code" => $code,
        "comment" => $comment,
        "activity" => "on",
        "date_create" => $currentDateTime
    ]);

    if ($query_add_meta->rowCount() > 0) {
        $lastInsertIdMeta = $dbh->lastInsertId();
        $query_get_meta = $dbh->prepare("SELECT * FROM `project_meta` WHERE `id` = :id");
        $query_get_meta->execute(["id" => $lastInsertIdMeta]);
        $meta = $query_get_meta->fetch(PDO::FETCH_OBJ);

        header("HTTP/1.1 200 ADDED");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($meta, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при добавлении записи", JSON_UNESCAPED_UNICODE);
    }
}