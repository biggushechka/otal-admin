<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'] ?? $_GET['id_site'];

$number_1 = $POST['number_1'];
$value_1 = $POST['value_1'];
$desc_1 = $POST['description_1'];

$number_2 = $POST['number_2'];
$value_2 = $POST['value_2'];
$desc_2 = $POST['description_2'];

$number_3 = $POST['number_3'];
$value_3 = $POST['value_3'];
$desc_3 = $POST['description_3'];

$number_4 = $POST['number_4'];
$value_4 = $POST['value_4'];
$desc_4 = $POST['description_4'];

// Получение
if ($method === "GET") {
    $query_get_row = $dbh->prepare("SELECT * FROM `site_advantages_num` WHERE `id_site` = :id_site");
    $query_get_row->execute(["id_site" => $id_site]);
    $adv_num = $query_get_row->fetch(PDO::FETCH_OBJ);

    if ($query_get_row->rowCount() != 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($adv_num, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 404 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Данных нет", JSON_UNESCAPED_UNICODE);
    }
}

// Запись
if ($method === "POST") {
    $query_get_row = $dbh->prepare("SELECT * FROM `site_advantages_num` WHERE `id_site` = :id_site");
    $query_get_row->execute(["id_site" => $id_site]);
    $adv_num = $query_get_row->fetchAll(PDO::FETCH_ASSOC);

    if (count($adv_num) == 0) {
        $query_create_row = $dbh->prepare("INSERT INTO `site_advantages_num` SET
            `id_site` = :id_site,
            `number_1` = :number_1,
            `value_1` = :value_1,
            `description_1` = :description_1,
            `number_2` = :number_2,
            `value_2` = :value_2,
            `description_2` = :description_2,
            `number_3` = :number_3,
            `value_3` = :value_3,
            `description_3` = :description_3,
            `number_4` = :number_4,
            `value_4` = :value_4,
            `description_4` = :description_4
         ");
        $query_create_row->execute([
            "id_site" => $id_site,
            "number_1" => $number_1,
            "value_1" => $value_1,
            "description_1" => $desc_1,
            "number_2" => $number_2,
            "value_2" => $value_2,
            "description_2" => $desc_2,
            "number_3" => $number_3,
            "value_3" => $value_3,
            "description_3" => $desc_3,
            "number_4" => $number_4,
            "value_4" => $value_4,
            "description_4" => $desc_4
        ]);
    } else {
        $query_create_row = $dbh->prepare("UPDATE `site_advantages_num` SET
            `id_site` = :id_site,
            `number_1` = :number_1,
            `value_1` = :value_1,
            `description_1` = :description_1,
            `number_2` = :number_2,
            `value_2` = :value_2,
            `description_2` = :description_2,
            `number_3` = :number_3,
            `value_3` = :value_3,
            `description_3` = :description_3,
            `number_4` = :number_4,
            `value_4` = :value_4,
            `description_4` = :description_4
            WHERE id_site = :id_site
         ");
        $query_create_row->execute([
            "id_site" => $id_site,
            "number_1" => $number_1,
            "value_1" => $value_1,
            "description_1" => $desc_1,
            "number_2" => $number_2,
            "value_2" => $value_2,
            "description_2" => $desc_2,
            "number_3" => $number_3,
            "value_3" => $value_3,
            "description_3" => $desc_3,
            "number_4" => $number_4,
            "value_4" => $value_4,
            "description_4" => $desc_4
        ]);
    }
}