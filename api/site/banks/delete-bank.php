<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

global $dbh;

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

// удаление сайта
if ($method === "DELETE") {
    $id_bank = $_GET['id'];

    $query_deleteBank = $dbh->prepare("DELETE FROM `project_banks` WHERE `id` = :id");
    $query_deleteBank->execute(["id" => $id_bank]);

    if ($query_deleteBank->rowCount() > 0) {
        header("HTTP/1.1 200 Delete");
        echo json_encode("Банк был успешно удален", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 409 Conflict");
        echo json_encode("Ошибка при удалении банка", JSON_UNESCAPED_UNICODE);
    }
}

die();