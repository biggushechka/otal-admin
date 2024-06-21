<?php

global $dbh;
$rootPath = $_SERVER['DOCUMENT_ROOT'];
require_once $rootPath . '/api/config/db_connect.php';

$id_site = $_GET['id_site'];
$date = $_GET['date'];
$type = $_GET['type'];

$queryDate = "";
$queryType = "";
$queryProject = "";

switch ($date) {
    case "today":
        $todayDate = date("Y-m-d");
//        $queryDate = "WHERE date_create = '{$todayDate}'";
//        $queryDate = "WHERE DATE(date_create) = '$todayDate'";
        $queryDate = "WHERE date_create >= CURRENT_DATE()";
        break;
    case "week":
        $week_start = date('Y-m-d', strtotime('this week'));
        $week_end = date('Y-m-d', strtotime('this week +6 days'));
        $queryDate = "WHERE date_create >= '{$week_start}' AND date_create <= '{$week_end}'";
        break;
    case "month":
        $month_start = date('Y-m-01');
        $month_end = date('Y-m-t');
        $queryDate = "WHERE date_create >= '{$month_start}' AND date_create <= '{$month_end}'";
        break;
    case "last-month":
        $month_start = date('Y-m-01', strtotime('first day of previous month'));
        $month_end = date('Y-m-t', strtotime('last day of previous month'));
        $queryDate = "WHERE date_create >= '{$month_start}' AND date_create <= '{$month_end}'";
        break;
    default:
        $queryDate = "";
        break;
}

if ($type != "all") {
    if ($queryDate == "") {
        $queryType = "WHERE type = '{$type}'";
    } else {
        $queryType = " AND type = '{$type}'";
    }
}

if ($type == "all" && $date == "all") {
    $queryProject = "WHERE id_site = '{$id_site}'";
} else {
    $queryProject = " AND id_site = '{$id_site}'";
}

$queryGetOrders = "SELECT * FROM `site_orders` " . $queryDate . $queryType . $queryProject . " ORDER BY date_create DESC";

//echo $queryGetOrders;
//return false;

$query_get_mata = $dbh->prepare($queryGetOrders);
$query_get_mata->execute();

$meta = $query_get_mata->fetchAll(PDO::FETCH_ASSOC);

if ($meta) {
    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($meta, JSON_UNESCAPED_UNICODE);
}