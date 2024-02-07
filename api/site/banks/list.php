<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id = $POST['id'] ?? $_GET['id'];
$id_site = $POST['id_site'] ?? $_GET['id_site'];
$id_bank = $POST['bank']['value'] ?? $_GET['bank']['value'];
$rate = $POST['rate'] ?? $_GET['rate'];
$initial_payment = $POST['initial_payment'] ?? $_GET['initial_payment'];
$currentDateTime = date('Y-m-d H:i:s');

// Получение
if ($method === "GET") {

    // получаем все по проекту
    $query_get_banks = $dbh->prepare("SELECT * FROM `project_banks` WHERE `id_site` = :id_site");
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

// отправить
if ($method === "POST") {
    $query_add_bank = $dbh->prepare("INSERT INTO `project_banks` SET
        `id_site` = :id_site,
        `id_bank` = :id_bank,
        `rate` = :rate,
        `initial_payment` = :initial_payment,
        `activity` = :activity,
        `date_create` = :date_create
    ");

    $query_add_bank->execute([
        "id_site" => $id_site,
        "id_bank" => $id_bank,
        "rate" => $rate,
        "initial_payment" => $initial_payment,
        "activity" => "on",
        "date_create" => $currentDateTime
    ]);

    if ($query_add_bank->rowCount() > 0) {
        $new_bank_id = $dbh->lastInsertId();
        $query_get_bank = $dbh->prepare("SELECT * FROM `project_banks` WHERE `id` = :id");
        $query_get_bank->execute(["id" => $new_bank_id]);
        $new_bank = $query_get_bank->fetch(PDO::FETCH_OBJ);


        // получаем все банки
        $query_get_allBanks = $dbh->prepare("SELECT * FROM `banks`");
        $query_get_allBanks->execute();
        $listAllBanks = $query_get_allBanks->fetchAll(PDO::FETCH_ASSOC);

        foreach ($listAllBanks as $foundBank) {
            if ($foundBank['id'] == $new_bank->id_bank) {
                $new_bank->logo = $foundBank['logo'];
                $new_bank->title = $foundBank['title'];
                break;
            }
        }

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($new_bank, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 409 Conflict");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при добавлении записи", JSON_UNESCAPED_UNICODE);
    }
}