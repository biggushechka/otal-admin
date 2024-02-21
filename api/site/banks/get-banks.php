<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id = $_GET['id'];
$id_site = $_GET['id_site'];
$id_bank = $_GET['bank']['value'];
$rate = $_GET['rate'];
$initial_payment = $_GET['initial_payment'];
$currentDateTime = date('Y-m-d H:i:s');

// Получение
if ($method === "GET") {
    // получаем все по проекту
    $query_get_banks = $dbh->prepare("SELECT * FROM `site_banks` WHERE `id_site` = :id_site");
    $query_get_banks->execute(["id_site" => $id_site]);
    $banks = $query_get_banks->fetchAll(PDO::FETCH_ASSOC);

    if ($query_get_banks->rowCount() != 0) {
        // получаем все банки
        $query_get_allBanks = $dbh->prepare("SELECT * FROM `banks`");
        $query_get_allBanks->execute();
        $listAllBanks = $query_get_allBanks->fetchAll(PDO::FETCH_ASSOC);

        $newListBanks = [];
        foreach ($banks as $bank) {
            foreach ($listAllBanks as $foundBank) {
                if ($foundBank['id'] == $bank['id_bank']) {
                    $bank['logo'] = $foundBank['logo'];
                    $bank['title'] = $foundBank['title'];
                    $newListBanks[] = $bank;
                    break;
                }
            }
        }

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($newListBanks, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Данных нет", JSON_UNESCAPED_UNICODE);
    }
}