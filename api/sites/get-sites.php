<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

// получение сайта
$getSites = $dbh->prepare("SELECT * FROM `my_sites`");
$getSites->execute();
$my_sites = $getSites->fetchAll(PDO::FETCH_ASSOC);

header("HTTP/1.1 200 OK");
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($my_sites, JSON_UNESCAPED_UNICODE);

$dbh = null;
die();