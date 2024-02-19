<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$post = json_decode($get_post_data, true);

$siteID = $post['id_site'] ?? $_GET['id_site'];
$title_project = $post['title_project'] ?? $_GET['title_project'];
$phone = $post['phone'] ?? $_GET['phone'];
$email = $post['email'] ?? $_GET['email'];
$telegram_phone = $post['telegram_phone'] ?? $_GET['telegram_phone'];
$telegram_link = $post['telegram_link'] ?? $_GET['telegram_link'];
$whatsapp_phone = $post['whatsapp_phone'] ?? $_GET['whatsapp_phone'];
$whatsapp_link = $post['whatsapp_link'] ?? $_GET['whatsapp_link'];
$currentDateTime = date('Y-m-d H:i:s');

// добавление
if ($method === "POST") {
    $query_update_general = $dbh->prepare("UPDATE `project_general` SET `title_project` = :title_project, `phone` = :phone, `email` = :email, `telegram_phone` = :telegram_phone, `telegram_link` = :telegram_link, `whatsapp_phone` = :whatsapp_phone, `whatsapp_link` = :whatsapp_link, `date_update` = :date_update WHERE `id_site` = :id_site");
    $query_update_general->execute([
        "id_site" => $siteID,
        "title_project" => $title_project,
        "phone" => $phone,
        "email" => $email,
        "telegram_phone" => $telegram_phone,
        "telegram_link" => $telegram_link,
        "whatsapp_phone" => $whatsapp_phone,
        "whatsapp_link" => $whatsapp_link,
        "date_update" => $currentDateTime
    ]);

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode("Данные успешно обновлены", JSON_UNESCAPED_UNICODE);
}

// Получение
if ($method === "GET") {
    $query_get_general = $dbh->prepare("SELECT * FROM `project_general` WHERE `id_site` = :id_site LIMIT 1");
    $query_get_general->execute(["id_site" => $siteID]);
    $data = "";

    // проверям, есть ли строка
    // если нет, то создаем пустую строку
    if ($query_get_general->rowCount() == 0) {
        $query_creat = $dbh->prepare("INSERT INTO `project_general` SET `id_site` = :id_site");
        $query_creat->execute(["id_site" => $siteID]);
        $lastInsertId = $dbh->lastInsertId();

        $query_get_general = $dbh->prepare("SELECT * FROM `project_general` WHERE `id_site` = :id_site LIMIT 1");
        $query_get_general->execute(["id_site" => $siteID]);
        $data = $query_get_general->fetch(PDO::FETCH_OBJ);
    } else {
        $data = $query_get_general->fetch(PDO::FETCH_OBJ);
    }

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}