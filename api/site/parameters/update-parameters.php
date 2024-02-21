<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$siteID = $POST['id_site'];
$class = $POST['class'];
$material_house = $POST['material_house'];
$number_apartments = $POST['number_apartments'];
$number_buildings = $POST['number_buildings'];
$finishing = $POST['finishing'];
$closed_territory = $POST['closed_territory'];
$area_apartments_from = $POST['area_apartments_from'];
$area_apartments_to = $POST['area_apartments_to'];
$floors_from = $POST['floors_from'];
$floors_to = $POST['floors_to'];
$ceiling_height_from = $POST['ceiling_height_from'];
$ceiling_height_to = $POST['ceiling_height_to'];
$date_start_construction = $POST['date_start_construction'];
$date_end_construction = $POST['date_end_construction'];


$query_update = $dbh->prepare("UPDATE `site_parameters` SET 
    `id_site` = :id_site, 
    `class` = :class, 
    `material_house` = :material_house, 
    `number_apartments` = :number_apartments, 
    `number_buildings` = :number_buildings, 
    `finishing` = :finishing, 
    `closed_territory` = :closed_territory, 
    `area_apartments_from` = :area_apartments_from, 
    `area_apartments_to` = :area_apartments_to, 
    `floors_from` = :floors_from, 
    `floors_to` = :floors_to, 
    `ceiling_height_from` = :ceiling_height_from, 
    `ceiling_height_to` = :ceiling_height_to, 
    `date_start_construction` = :date_start_construction, 
    `date_end_construction` = :date_end_construction 
    WHERE `id_site` = :id_site");

$query_update->execute([
    "id_site" => $siteID,
    "class" => $class,
    "material_house" => $material_house,
    "number_apartments" => $number_apartments,
    "number_buildings" => $number_buildings,
    "finishing" => $finishing,
    "closed_territory" => $closed_territory,
    "area_apartments_from" => $area_apartments_from,
    "area_apartments_to" => $area_apartments_to,
    "floors_from" => $floors_from,
    "floors_to" => $floors_to,
    "ceiling_height_from" => $ceiling_height_from,
    "ceiling_height_to" => $ceiling_height_to,
    "date_start_construction" => $date_start_construction,
    "date_end_construction" => $date_end_construction
]);

$rowCount = $query_update->rowCount();

if ($rowCount > 0) {
    header("HTTP/1.1 200 UPDATE");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode("Данные были успешно обновлены", JSON_UNESCAPED_UNICODE);
} else {
    header("HTTP/1.1 400 Bad Request");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode("Ошибка при обновлении данных", JSON_UNESCAPED_UNICODE);
}

$dbh = null;
die();