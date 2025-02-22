<?php

function getBanks($id_site) {
    global $dbh;
    $banks = [];

    $query_get_banks = $dbh->prepare("SELECT * FROM `site_banks` WHERE `id_site` = :id_site AND `activity` = :activity");
    $query_get_banks->execute(["id_site" => $id_site, "activity" => "on"]);

    if ($query_get_banks->rowCount() > 0) {
        $listBanks = $query_get_banks->fetchAll(PDO::FETCH_ASSOC);

        foreach ($listBanks as &$bank) {
            $getDataBank = $dbh->prepare("SELECT * FROM `banks` WHERE `id` = :id_bank LIMIT 1");
            $getDataBank->execute(["id" => $bank["id_bank"]]);

            if ($getDataBank->rowCount() > 0) {
                $dataBankItem = $getDataBank->fetch(PDO::FETCH_OBJ);
                $banks[] = $dataBankItem;
            }
        }

    }

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($banks, JSON_UNESCAPED_UNICODE);
}