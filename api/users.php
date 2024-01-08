<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

if ($method == "GET") {
    $sth = $dbh->prepare("SELECT * FROM `users`");
    $sth->execute();
    $users = $sth->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: text/html; charset=UTF-8');
    echo json_encode($users, JSON_UNESCAPED_UNICODE);
} else if ($method == "POST") {
    echo json_encode("Пользователей не найдено", JSON_UNESCAPED_UNICODE);
}