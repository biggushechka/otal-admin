<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';


if ($method == "GET") {
    $sth = $dbh->prepare("SELECT * FROM `users`");
    $sth->execute();
    $users = $sth->fetchAll(PDO::FETCH_ASSOC);

    print_r("<pre>");
    print_r($users);
    print_r("</pre>");

    header('Content-Type: text/html; charset=UTF-8');
    echo json_encode($users, JSON_UNESCAPED_UNICODE);
} else if ($method == "POST") {
    echo json_encode("error");
}