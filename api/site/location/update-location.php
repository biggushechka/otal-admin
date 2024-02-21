<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'];
$address = $POST['address'];
$country = $POST['country'];
$federal_district = $POST['federal_district'];
$region = $POST['region'];
$region_type = $POST['region_type'];
$region_with_type = $POST['region_with_type'];
$region_type_full = $POST['region_type_full'];
$settlement_type_full = $POST['settlement_type_full'];
$settlement_with_type = $POST['settlement_with_type'];
$city = $POST['city'];
$city_type = $POST['city_type'];
$city_with_type = $POST['city_with_type'];
$city_type_full = $POST['city_type_full'];
$street = $POST['street'];
$street_type = $POST['street_type'];
$street_type_full = $POST['street_type_full'];
$street_with_type = $POST['street_with_type'];
$house = $POST['house'];
$house_type = $POST['house_type'];
$house_type_full = $POST['house_type_full'];
$block = $POST['block'];
$block_type = $POST['block_type'];
$block_type_full = $POST['block_type_full'];
$latitude = $POST['latitude'];
$longitude = $POST['longitude'];
$currentDateTime = date('Y-m-d H:i:s');


// Получение
$query_get = $dbh->prepare("SELECT * FROM `site_location` WHERE `id_site` = :id_site LIMIT 1");
$query_get->execute(["id_site" => $id_site]);
$id_row = "";

if ($query_get->rowCount() === 0) {
    $query_creat = $dbh->prepare("INSERT INTO `site_location` SET `id_site` = :id_site");
    $query_creat->execute(["id_site" => $id_site]);

    $id_row = $dbh->lastInsertId();
    $query_get_desc = $dbh->prepare("SELECT * FROM `site_location` WHERE `id` = :id LIMIT 1");
    $query_get_desc->execute(["id" => $id_row]);
} else {
    $get_row = $query_get->fetch(PDO::FETCH_OBJ);
    $id_row = $get_row->id;
}

// Запись
if ($method === "POST") {
    $query_update = $dbh->prepare("UPDATE `site_location` SET  
        `address` = :address,
        `country` = :country,
        `federal_district` = :federal_district,
        `region` = :region,
        `region_type` = :region_type,
        `region_with_type` = :region_with_type,
        `region_type_full` = :region_type_full,
        `settlement_type_full` = :settlement_type_full,
        `settlement_with_type` = :settlement_with_type,
        `city` = :city,
        `city_type` = :city_type,
        `city_with_type` = :city_with_type,
        `city_type_full` = :city_type_full,
        `street` = :street,
        `street_type` = :street_type,
        `street_type_full` = :street_type_full,
        `street_with_type` = :street_with_type,
        `house` = :house,
        `house_type` = :house_type,
        `house_type_full` = :house_type_full,
        `block` = :block,
        `block_type` = :block_type,
        `block_type_full` = :block_type_full,
        `latitude` = :latitude,
        `longitude` = :longitude,
        `date_update` = :date_update 
        WHERE `id` = :id");

    $query_update->execute([
        "id" => $id_row,
        "address" => $address,
        "country" => $country,
        "federal_district" => $federal_district,
        "region" => $region,
        "region_type" => $region_type,
        "region_with_type" => $region_with_type,
        "region_type_full" => $region_type_full,
        "settlement_type_full" => $settlement_type_full,
        "settlement_with_type" => $settlement_with_type,
        "city" => $city,
        "city_type" => $city_type,
        "city_with_type" => $city_with_type,
        "city_type_full" => $city_type_full,
        "street" => $street,
        "street_type" => $street_type,
        "street_type_full" => $street_type_full,
        "street_with_type" => $street_with_type,
        "house" => $house,
        "house_type" => $house_type,
        "house_type_full" => $house_type_full,
        "block" => $block,
        "block_type" => $block_type,
        "block_type_full" => $block_type_full,
        "latitude" => $latitude,
        "longitude" => $longitude,
        "date_update" => $currentDateTime
    ]);
    $rowCount = $query_update->rowCount();

    if ($rowCount > 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Данные были успешно обновлены", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при обновлении данных", JSON_UNESCAPED_UNICODE);
    }
}