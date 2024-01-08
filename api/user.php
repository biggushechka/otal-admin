<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$id = $_GET['id'];

if ($method === "GET") {
    $sth = $dbh->prepare("SELECT * FROM `users` WHERE `id` = :id LIMIT 1");
    $sth->execute(["id" => $id]);
    $user = $sth->fetch(PDO::FETCH_OBJ);

    if(!$user) {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(['user'=>'null'], JSON_UNESCAPED_UNICODE);
    } else {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($user, JSON_UNESCAPED_UNICODE);
    }

    die();
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(['user'=>null], JSON_UNESCAPED_UNICODE);
}

die();