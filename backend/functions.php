<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];

function connectServerFTP() {
    // Параметры FTP-соединения
    $hostname = 'novato1v.beget.tech';
    $port = 21;
    $ftpUsername = 'novato1v';
    $ftpPassword = 'F8t5vkza';
    $ftpPath = "otal-estate.ru/public_html";

    // Создание подключения FTP
    $connId = ftp_connect($hostname, $port);
    $loginResult = ftp_login($connId, $ftpUsername, $ftpPassword);

    // Проверка подключения и авторизации
    if ($connId && $loginResult) {
        if (!ftp_chdir($connId, $ftpPath)) {
            exit('Не удалось перейти по указанному пути на сервере');
        } else {
            return $connId;
        }
    } else {
        echo "Не удалось соединиться с удаленным сервером.";
    }
}

// Поверка директории
function ftp_directory_exists($conn_id, $dir) {
    $isFolder = "false";
    $origin = ftp_pwd($conn_id);

    if (@ftp_chdir($conn_id, $dir)) {
        ftp_chdir($conn_id, $origin);
        $isFolder = "true";
    }

    return $isFolder;
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
        imagewebp($newImage, $stream, 80);

        // Перемещаем указатель потока в начало
        rewind($stream);

        // Читаем данные из потока и преобразуем их в строку
        $webpData = stream_get_contents($stream);

        // Закрываем поток
        fclose($stream);

        // Кодируем данные в формат base64
        $base64Webp = base64_encode($webpData);

        $imageSizeInBytes = strlen($webpData);

        $image['ext'] = "webp";
        $image['base'] = $base64Webp;
        $image['size'] = $imageSizeInBytes;

        $convertedImages[] = $image;
    }

    return $convertedImages;
}

function saveFile($file, $uploadDir) {
    $imageData = base64_decode($file['base']);
    $fileName = $file['name'] . "." . $file['ext'];
    $imageResource = imagecreatefromstring($imageData); // Создание изображения из данных в формате base64
    $localPath = $_SERVER['DOCUMENT_ROOT'] . "/" . $uploadDir . "/" . $fileName;
    $localPathFolder = $_SERVER['DOCUMENT_ROOT'] . "/" . $uploadDir;
    $remotePath = $uploadDir . "/" . $fileName;
    $isSaveFile = "";

    // проверяем, есть ли в локальном проекте нужна папка, если нет - создаем
    if (!file_exists($localPathFolder)) {
        mkdir($localPathFolder, 0777, true);
    }

    // проверяем, сохранилось ли изображение
    if (imagewebp($imageResource, $localPath, 80)) {
        $isSaveFile = "true";
    } else {
        $isSaveFile = "false";
    }

    // если файл не сохранился, останавливаем скрипт
    if ($isSaveFile === "false") return false;

    // Сохранение файл на сервер, если мы локально загрузили файл
    if ($_SERVER['HTTP_HOST'] != 'otal-estate.ru') {
        $serverConnect = connectServerFTP();

        ftp_pasv($serverConnect, true);

        // Проверка существования папки
        if (ftp_directory_exists($serverConnect, $uploadDir) == "false") {
            if (!ftp_mkdir($serverConnect, $uploadDir)) $isSaveFile = "false";
        }

        // сохраняем файл на сервере
        if (!ftp_put($serverConnect, $remotePath, $localPath, FTP_BINARY) ) {
            $isSaveFile = "false";
        }

        // закрываем FTP
        ftp_close($serverConnect);

        // удаляем локальный файл
        $localMediaFolder = $_SERVER['DOCUMENT_ROOT'] . "/api/media";
        deleteDirectory($localMediaFolder);
    }

    // Освобождение памяти
    imagedestroy($imageResource);

    return $isSaveFile;
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

// Функция для удаления конкретного файла
function deleteFile($filePath) {
    global $rootPath;
    $localPath = $rootPath . "/" . $filePath;
    $detele_file = "false";

    if ($_SERVER['HTTP_HOST'] != 'otal-estate.ru') {
        $serverConnect = connectServerFTP();

        ftp_pasv($serverConnect, true);

        // Проверяем наличие файла на FTP сервере
        if (ftp_size($serverConnect, $filePath) != -1) {
            // Файл существует, удаляем его
            if (ftp_delete($serverConnect, $filePath)) {
                $detele_file = "true";
            } else {
                $detele_file = "false";
            }
        } else {
            $detele_file = "true";
        }

        // закрываем FTP
        ftp_close($serverConnect);
    } else {
        if (is_file($localPath)) {
            $detele_file = "true";
            unlink($localPath);
        }
    }

    return $detele_file;
}