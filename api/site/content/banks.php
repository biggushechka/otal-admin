<?php

function getBanks($id_site) {
    global $dbh;
    $banks = [];

    $query_get_banks = $dbh->prepare("SELECT * FROM `site_banks` WHERE `id_site` = :id_site AND `activity` = :activity");
    $query_get_banks->execute(["id_site" => $id_site, "activity" => "on"]);

    if ($query_get_banks->rowCount() > 0) {
        foreach ($query_get_banks as $bank) {
            $getDataBank = $dbh->prepare("SELECT * FROM `banks` WHERE `id_bank` = :id_bank");
            $getDataBank->execute(["id_bank" => $bank["id_bank"]]);

            if ($getDataBank->rowCount() > 0) {
                $getDataBank = $getDataBank->fetch(PDO::FETCH_OBJ);
//                $bankItem = new stdClass();
//                $bankItem->title = $bank["title"];
//                $bankItem->photo = "";
//                $bankItem->rate = $bank["rate"];
//                $bankItem->initial_payment = $bank["initial_payment"];

                $banks[] = $getDataBank;
            }
        }
    }

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($banks, JSON_UNESCAPED_UNICODE);
}