<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

// получение сайта
$getSites = $dbh->prepare("SELECT * FROM `my_sites`");
$getSites->execute();
$my_sites = $getSites->fetchAll(PDO::FETCH_ASSOC);

// добавляем все полученные сайты в "разрешенные сайты" для использования API
$allowedOrigins = [];
foreach ($my_sites as $site) {
    $allowedOrigins[] = $site['domain'];
}
$jsonString = json_encode($allowedOrigins);
file_put_contents($rootPath . "/api/config/allowed-origins.txt", $jsonString);

header("HTTP/1.1 200 OK");
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($my_sites, JSON_UNESCAPED_UNICODE);

$dbh = null;
die();