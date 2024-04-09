<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

// удаление банка
if ($method === "DELETE") {
    $id_bank = $_GET['id'];

    $query_deleteBank = $dbh->prepare("DELETE FROM `site_banks` WHERE `id` = :id");
    $query_deleteBank->execute(["id" => $id_bank]);

    if ($query_deleteBank->rowCount() > 0) {
        header("HTTP/1.1 200 DELETE");
        echo json_encode("Банк был успешно удален", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode("Ошибка при удалении банка", JSON_UNESCAPED_UNICODE);
    }
}

die();