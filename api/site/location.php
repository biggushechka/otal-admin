<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'] ?? $_GET['id_site'];
$address = $POST['address'] ?? $_GET['address'];
$country = $POST['country'] ?? $_GET['country'];
$federal_district = $POST['federal_district'] ?? $_GET['federal_district'];
$region = $POST['region'] ?? $_GET['region'];
$region_type = $POST['region_type'] ?? $_GET['region_type'];
$region_with_type = $POST['region_with_type'] ?? $_GET['region_with_type'];
$region_type_full = $POST['region_type_full'] ?? $_GET['region_type_full'];
$settlement_type_full = $POST['settlement_type_full'] ?? $_GET['settlement_type_full'];
$settlement_with_type = $POST['settlement_with_type'] ?? $_GET['settlement_with_type'];
$city = $POST['city'] ?? $_GET['city'];
$city_type = $POST['city_type'] ?? $_GET['city_type'];
$city_with_type = $POST['city_with_type'] ?? $_GET['city_with_type'];
$city_type_full = $POST['city_type_full'] ?? $_GET['city_type_full'];
$street = $POST['street'] ?? $_GET['street'];
$street_type = $POST['street_type'] ?? $_GET['street_type'];
$street_type_full = $POST['street_type_full'] ?? $_GET['street_type_full'];
$street_with_type = $POST['street_with_type'] ?? $_GET['street_with_type'];
$house = $POST['house'] ?? $_GET['house'];
$house_type = $POST['house_type'] ?? $_GET['house_type'];
$house_type_full = $POST['house_type_full'] ?? $_GET['house_type_full'];
$block = $POST['block'] ?? $_GET['block'];
$block_type = $POST['block_type'] ?? $_GET['block_type'];
$block_type_full = $POST['block_type_full'] ?? $_GET['block_type_full'];
$latitude = $POST['latitude'] ?? $_GET['latitude'];
$longitude = $POST['longitude'] ?? $_GET['longitude'];
$currentDateTime = date('Y-m-d H:i:s');


// Получение
if ($method === "GET") {
    $query_get = $dbh->prepare("SELECT * FROM `project_location` WHERE `id_site` = :id_site LIMIT 1");
    $query_get->execute(["id_site" => $id_site]);
    $location = $query_get->fetch(PDO::FETCH_OBJ);

    if ($query_get->rowCount() != 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($location, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
    }
}

// Запись
if ($method === "POST") {
    $query_update = $dbh->prepare("UPDATE `project_location` SET  
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
        WHERE `id_site` = :id_site");

    $query_update->execute([
        "id_site" => $id_site,
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