<?php

global $dbh;
$rootPath = $_SERVER['DOCUMENT_ROOT'];
require_once $rootPath . '/api/db_connect.php';
require_once $rootPath . '/backend/functions.php';

// удаление проекта
$id_site = $_GET['id_site'];

// Выполнение запроса на получение таблиц
$stmt = $dbh->query("SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME = 'id_site'");
$tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

// Выполнение запроса на удаление записей из всех таблиц
foreach ($tables as $table) {
    if ($table == "project_gallery_image") deletePhoto("project_gallery_image", $id_site);;
    if ($table == "project_photos") deletePhoto("project_photos", $id_site);;

    $query_remove = $dbh->prepare("DELETE FROM $table WHERE `id_site` = :id_site");
    $query_remove->execute(["id_site" => $id_site]);
    $count = $query_remove->rowCount();

    echo "($id_site): Удалено $count записей из таблицы - $table\n";
}

$query_removeProject = $dbh->prepare("DELETE FROM `my_sites` WHERE `id` = :id");
$query_removeProject->execute(["id" => $id_site]);

if ($query_removeProject->rowCount() > 0) {
    header("HTTP/1.1 200 UPDATE");
    header('Content-Type: application/json; charset=UTF-8');
}

function deletePhoto($nameTable, $id_site) {
    global $dbh;
    $deleteCount = 0;

    $query_find_images = $dbh->prepare("SELECT * FROM $nameTable WHERE id_site = :id_site");
    $query_find_images->execute(["id_site" => $id_site]);
    $allImages = $query_find_images->fetchAll(PDO::FETCH_ASSOC);

    echo "кол-во: ".count($allImages)." \n";

    foreach ($allImages as &$image) {
        $parsed_url = parse_url($image['image']);
        $pathFile = $parsed_url['path'];
        $pathFile = ltrim($pathFile, '/');

        echo $pathFile . "\n";

        // удаляем файл на сервере
        $delete_file = deleteFile($pathFile);

        // если файл был успешно удален, то удаляем запись из таблицы
        if ($delete_file != "false") {
            $query_delete_row = $dbh->prepare("DELETE FROM $nameTable WHERE `id` = :id");
            $query_delete_row->execute(["id" => $image['id']]);

            if ($query_delete_row->rowCount() > 0) {
                $deleteCount++;

                echo "удалено: $deleteCount \n";
            }
        }
    }
}

die();