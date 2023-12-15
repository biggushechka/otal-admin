<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/db_connect.php';


$siteID = $_POST['id_site'] ?? $_GET['id_site'];
$title_project = $_POST['title_project'] ?? $_GET['title_project'];
$phone = $_POST['phone'] ?? $_GET['phone'];
$email = $_POST['email'] ?? $_GET['email'];
$telegram_phone = $_POST['telegram_phone'] ?? $_GET['telegram_phone'];
$telegram_link = $_POST['telegram_link'] ?? $_GET['telegram_link'];
$whatsapp_phone = $_POST['whatsapp_phone'] ?? $_GET['whatsapp_phone'];
$whatsapp_link = $_POST['whatsapp_link'] ?? $_GET['whatsapp_link'];
$currentDateTime = date('Y-m-d H:i:s');

// добавление
if ($method === "UPDATE") {
    $query_update_general = $dbh->prepare("UPDATE `project_general` SET `title_project` = :title_project, `phone` = :phone, `email` = :email, `telegram_phone` = :telegram_phone, `telegram_link` = :telegram_link, `whatsapp_phone` = :whatsapp_phone, `whatsapp_link` = :whatsapp_link, `date_update` = :date_update WHERE `id_site` = :id_site");
    $query_update_general->execute([
        "id_site" => $siteID,
        "title_project" => $title_project,
        "phone" => $phone, "email" => $email,
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
    $data = $query_get_general->fetch(PDO::FETCH_OBJ);

    header("HTTP/1.1 200 OK");
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
}