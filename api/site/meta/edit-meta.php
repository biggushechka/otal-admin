<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

global $dbh;

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_meta = $POST['id'];
$title = $POST['title'];
$code = $POST['code'];
$comment = $POST['comment'];
$currentDateTime = date('Y-m-d H:i:s');

// отправить
if ($method === "POST") {

    $query_update = $dbh->prepare("UPDATE `project_meta` SET
        `title` = :title,
        `code` = :code,
        `comment` = :comment,
        `date_create` = :date_create
        WHERE `id` = :id
    ");

    $query_update->execute([
        "id" => $id_meta,
        "title" => $title,
        "code" => $code,
        "comment" => $comment,
        "date_create" => $currentDateTime
    ]);

    if ($query_update->rowCount() > 0) {
        $query_get_meta = $dbh->prepare("SELECT * FROM `project_meta` WHERE `id` = :id");
        $query_get_meta->execute(["id" => $id_meta]);
        $update_meta = $query_get_meta->fetch(PDO::FETCH_OBJ);

        header("HTTP/1.1 200 UPDATE");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($update_meta, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при обновлении записи", JSON_UNESCAPED_UNICODE);
    }
}