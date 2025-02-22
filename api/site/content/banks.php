<?php

function getBanks($id_site) {
    global $dbh;
    $banks = [];

    $arrayBanks = [];
    $query_get_banks = $dbh->prepare("SELECT * FROM `site_banks` WHERE `id_site` = :id_site AND `activity` = :activity");
    $query_get_banks->execute(["id_site" => $id_site, "activity" => "on"]);

    if ($query_get_banks->rowCount() > 0) {
        $arrayBanks = $query_get_banks->fetchAll(PDO::FETCH_ASSOC);

        $query_get_AllBanks = $dbh->prepare("SELECT * FROM `banks`");
        $query_get_AllBanks->execute();

        if ($query_get_AllBanks->rowCount() > 0) {
            foreach ($arrayBanks as $bank) {
                $bankItem = new stdClass();

                $bankItem->title = $bank["title"];
                $bankItem->photo = "";
                $bankItem->rate = $bank["rate"];
                $bankItem->initial_payment = $bank["initial_payment"];

                $banks[] = $bankItem;
            }
        }
    }

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($arrayBanks, JSON_UNESCAPED_UNICODE);
}