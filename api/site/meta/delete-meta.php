<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

// удаление meta
if ($method === "DELETE") {
    $id_meta = $_GET['id'];

    $query_deleteBank = $dbh->prepare("DELETE FROM `project_meta` WHERE `id` = :id");
    $query_deleteBank->execute(["id" => $id_meta]);

    if ($query_deleteBank->rowCount() > 0) {
        header("HTTP/1.1 200 Delete");
        echo json_encode("Банк был успешно удален", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode("Ошибка при удалении банка", JSON_UNESCAPED_UNICODE);
    }
}

die();