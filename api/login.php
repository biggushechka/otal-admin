<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';

$login = $_POST['login'];
$password = hash('sha256', $_POST['password']);

if ($method === "POST") {
    $sth = $dbh->prepare("SELECT * FROM `users` WHERE `login` = :login LIMIT 1");
    $sth->execute(["login" => $login]);
    $user = $sth->fetch(PDO::FETCH_OBJ);

    if(!$user) {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(['user'=>'null'], JSON_UNESCAPED_UNICODE);
    } else {
        if ($user->password === $password) {
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode($user, JSON_UNESCAPED_UNICODE);
        } else {
            header("HTTP/1.1 404 Not Found");
            echo json_encode(['user'=>'не правильный пароль'], JSON_UNESCAPED_UNICODE);
        }
    }
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode(['user'=>null], JSON_UNESCAPED_UNICODE);
}
$dbh = null;
die();