<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

global $dbh;

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_row = $POST['id'];
$rate = $POST['rate'];
$initial_payment = $POST['initial_payment'];

// отправить
if ($method === "POST") {
    
    $query_update_bank = $dbh->prepare("UPDATE `site_banks` SET
        `rate` = :rate,
        `initial_payment` = :initial_payment
        WHERE `id` = :id
    ");

    $query_update_bank->execute([
        "id" => $id_row,
        "rate" => $rate,
        "initial_payment" => $initial_payment
    ]);

    if ($query_update_bank->rowCount() > 0) {
        $query_get_bank = $dbh->prepare("SELECT * FROM `site_banks` WHERE `id` = :id");
        $query_get_bank->execute(["id" => $id_row]);
        $update_bank = $query_get_bank->fetch(PDO::FETCH_OBJ);

        // получаем все банки
        $query_get_allBanks = $dbh->prepare("SELECT * FROM `banks`");
        $query_get_allBanks->execute();
        $listAllBanks = $query_get_allBanks->fetchAll(PDO::FETCH_ASSOC);

        foreach ($listAllBanks as $foundBank) {
            if ($foundBank['id'] == $update_bank->id_bank) {
                $update_bank->logo = $foundBank['logo'];
                $update_bank->title = $foundBank['title'];
                break;
            }
        }

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($update_bank, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при добавлении записи", JSON_UNESCAPED_UNICODE);
    }
}