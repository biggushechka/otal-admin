<?php

function getAdvantages($id_site) {
    global $dbh;
    $adv = new stdClass();

    $query_get_adv = $dbh->prepare("SELECT * FROM `site_advantages` WHERE `id_site` = :id_site AND `activity` = :activity");
    $query_get_adv->execute(["id_site" => $id_site, "activity" => "on"]);

    if ($query_get_adv->rowCount() > 0) {
        $advData = $query_get_adv->fetchAll(PDO::FETCH_ASSOC);

        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($advData, JSON_UNESCAPED_UNICODE);
    }

    $dbh = null;
    die();
}