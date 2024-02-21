<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$siteID = $POST['id_site'];
$title_project = $POST['title_project'];
$phone = $POST['phone'];
$email = $POST['email'];
$telegram_phone = $POST['telegram_phone'];
$telegram_link = $POST['telegram_link'];
$whatsapp_phone = $POST['whatsapp_phone'];
$whatsapp_link = $POST['whatsapp_link'];
$currentDateTime = date('Y-m-d H:i:s');

$query_update_general = $dbh->prepare("UPDATE `site_general` SET `title_project` = :title_project, `phone` = :phone, `email` = :email, `telegram_phone` = :telegram_phone, `telegram_link` = :telegram_link, `whatsapp_phone` = :whatsapp_phone, `whatsapp_link` = :whatsapp_link, `date_update` = :date_update WHERE `id_site` = :id_site");
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

$dbh = null;
die();