<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = $POST['id_site'] ?? $_GET['id_site'];
$target = $POST['target'] ?? $_GET['target'];
$title_jk = $POST['title_jk'] ?? $_GET['title_jk'];
$desc_jk = $POST['desc_jk'] ?? $_GET['desc_jk'];
$title_territory = $POST['title_territory'] ?? $_GET['title_territory'];
$desc_territory = $POST['desc_territory'] ?? $_GET['desc_territory'];
$currentDateTime = date('Y-m-d H:i:s');

// Получение
if ($method === "GET") {
    $query_get_desc = $dbh->prepare("SELECT * FROM `project_description` WHERE `id_site` = :id_site LIMIT 1");
    $query_get_desc->execute(["id_site" => $id_site]);
    $desc = $query_get_desc->fetch(PDO::FETCH_OBJ);

    if ($query_get_desc->rowCount() != 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($desc, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 204 Not Found");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при получении", JSON_UNESCAPED_UNICODE);
    }
}

// отправить
if ($method === "POST") {
    $query_update_desc = typeDesc($target);
    $rowCount = $query_update_desc->rowCount();

    if ($rowCount > 0) {
        header("HTTP/1.1 200 OK");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Данные были успешно обновлены", JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad Request");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode("Ошибка при обновлении данных", JSON_UNESCAPED_UNICODE);
    }
}

function typeDesc($target) {
    global $dbh, $id_site, $title_jk, $desc_jk, $title_territory, $desc_territory, $currentDateTime;
    $query = "";

    switch ($target) {
        case "about":
            $query = $dbh->prepare("UPDATE `project_description` SET  
            `title_jk` = :title_jk, 
            `desc_jk` = :desc_jk, 
            `date_update` = :date_update 
            WHERE `id_site` = :id_site");

            $query->execute([
                "id_site" => $id_site,
                "title_jk" => $title_jk,
                "desc_jk" => $desc_jk,
                "date_update" => $currentDateTime
            ]);

            break;
        case "territory":
            $query = $dbh->prepare("UPDATE `project_description` SET  
            `title_territory` = :title_territory, 
            `desc_territory` = :desc_territory,
            `date_update` = :date_update 
            WHERE `id_site` = :id_site");

            $query->execute([
                "id_site" => $id_site,
                "title_territory" => $title_territory,
                "desc_territory" => $desc_territory,
                "date_update" => $currentDateTime
            ]);

            break;
    }

    return $query;
}