<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$login = $POST['username'];
$password = hash('sha256', $POST['password']);


$findUser = $dbh->prepare("SELECT * FROM `users` WHERE `login` = :login LIMIT 1");
$findUser->execute(["login" => $login]);

if ($findUser->rowCount() > 0) {
    $user = $findUser->fetch(PDO::FETCH_OBJ);

    if ($user->password === $password) {
        header("HTTP/1.1 200 OK");
        echo json_encode($user, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 401 Unauthorized");
        echo json_encode("Неверный логин или пароль, попробуйте заново", JSON_UNESCAPED_UNICODE);
    }
} else {
    header("HTTP/1.1 404 Not Found");
    echo json_encode("Такого пользователя не существует", JSON_UNESCAPED_UNICODE);
}


$dbh = null;
die();