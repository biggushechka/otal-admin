<?php

global $rootPath;

$rootPath = $_SERVER['DOCUMENT_ROOT'];

function connectServerFTP() {
    // Параметры FTP-соединения
    $ftpHost = 'novato1v.beget.tech';
    $ftpUsername = 'novato1v';
    $ftpPassword = 'F8t5vkza';
    $ftpPath = "otal-estate.ru/public_html";

    // Создание подключения FTP
    $connId = ftp_connect($ftpHost);
    $loginResult = ftp_login($connId, $ftpUsername, $ftpPassword);

    // Проверка подключения и авторизации
    if ($connId && $loginResult) {
        if (!ftp_chdir($connId, $ftpPath)) {
            exit('Не удалось перейти по указанному пути на сервере');
        }
        return $connId;
    } else {
        echo "Не удалось соединиться с удаленным сервером.";
    }
}


function convertImagesToWebP($images) {
    $convertedImages = [];

    foreach ($images as &$image) {
        $originalImageBase = $image['base'];

        // Декодируем base64-кодированную строку в бинарные данные
        $imageData = base64_decode($originalImageBase);

        // Создаем изображение из бинарных данных
        $newImage = imagecreatefromstring($imageData);

        // Создаем пустой ресурс для нового изображения
        $newImageResource = imagecreatetruecolor(imagesx($newImage), imagesy($newImage));

        // Копируем оригинальное изображение в новый ресурс
        imagecopy($newImageResource, $newImage, 0, 0, 0, 0, imagesx($newImage), imagesy($newImage));

        // Создаем пустой поток
        $stream = fopen('php://temp', 'r+');

        // Сохраняем новое изображение в поток формата WebP
        imagewebp($newImage, $stream, 100);

        // Перемещаем указатель потока в начало
        rewind($stream);

        // Читаем данные из потока и преобразуем их в строку
        $webpData = stream_get_contents($stream);

        // Закрываем поток
        fclose($stream);

        // Кодируем данные в формат base64
        $base64Webp = base64_encode($webpData);

        $image['ext'] = "webp";
        $image['base'] = $base64Webp;

        $convertedImages[] = $image;
    }

    return $convertedImages;
}

function saveFile($file, $uploadDir) {

    echo "<pre>";
    print_r($file);
    echo "</pre>";

    $imageData = base64_decode($file['base']);
    $fileName = $file['name'] . "." . $file['ext'];
    $imageResource = imagecreatefromstring($imageData); // Создание изображения из данных в формате base64
    $localPath = $_SERVER['DOCUMENT_ROOT'] . "/" . $uploadDir . "/" . $fileName;
    $localPathFolder = $_SERVER['DOCUMENT_ROOT'] . "/" . $uploadDir;

    if (!file_exists($localPathFolder)) {
        mkdir($localPathFolder, 0777, true);
    }

    if (imagewebp($imageResource, $localPath)) {
        echo "img upload";
    } else {
        echo "img not upload.";
    }

    imagedestroy($imageResource); // Освобождение памяти

    // Сохранение изображения в формате WebP
    if ($_SERVER['HTTP_HOST'] != 'otal-estate.ru') {
        $serverConnect = connectServerFTP();
        $remotePath = $uploadDir . "/" .$fileName;

        // проверяем сущ. ли папка "api/media/cover"
        $fileList = ftp_nlist($serverConnect, $uploadDir);

        // если такой нет, то создаем "api/media/cover"
        if ($fileList === false) {
            ftp_mkdir($serverConnect, $uploadDir);
        }

        // сохраняем файл на сервере
        ftp_put($serverConnect, $remotePath, $localPath, FTP_BINARY);

        // закрываем FTP
        ftp_close($serverConnect);

        $localMediaFolder = $_SERVER['DOCUMENT_ROOT'] . "/api/media";
        deleteDirectory($localMediaFolder);
    }
}


function deleteDirectory($directory) {
    if (!is_dir($directory)) {
        // Если заданная директория не существует, или не является директорией, просто выходите из функции
        return;
    }

    // Получаем список элементов в директории
    $items = glob($directory . '/*');

    foreach ($items as $item) {
        if (is_dir($item)) {
            // Если элемент является директорией, рекурсивно вызываем ту же функцию для удаления этой подпапки
            deleteDirectory($item);
        } else {
            // Если элемент является файлом, удаляем его
            unlink($item);
        }
    }

    // Удаляем саму папку
    rmdir($directory);
}