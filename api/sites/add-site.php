<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];

require_once $rootPath . '/api/config/db_connect.php';
require_once $rootPath . '/vendor/autoload.php'; // Подключаем автозагрузчик Composer
use phpseclib3\Net\SSH2;

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$title = $POST['title'];
$domain = $POST['domain'];
$currentDateTime = date('Y-m-d H:i:s');

// проверяем, есть ли уже такой сайт в БД по (title, domain)
$query_findSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `title` = :title OR `domain` = :domain LIMIT 1");
$query_findSite->execute(["title" => $title, "domain" => $domain]);
$isSite = $query_findSite->fetch(PDO::FETCH_OBJ);




$ssh = new SSH2('s744875.smrtp.ru', 22122);
if (!$ssh->login('user744875', 'm3WfF65xoCpG')) {
    exit('Login Failed');
}

// Перейдем в папку www
$ssh->exec('cd www');

// Теперь выполняем команды в папке www
$currentDirectory = $ssh->exec('pwd'); // Получаем текущую директорию
echo 'Текущая директория: ' . trim($currentDirectory);

// Или вы можете выполнять другую команду, например список файлов в www
$fileList = $ssh->exec('ls');
echo 'Содержимое директории www: ' . trim($fileList);



exit();















// если сайт уже существет, то выдаем ошибку
if ($isSite) {
    header("HTTP/1.1 304 Not Modified");
    echo json_encode("Сайт с таким названием или доменом уже существует", JSON_UNESCAPED_UNICODE);
} else {
    $referer = parse_url($domain); // конвертирует URL в строку
    $refererDomain = $referer['host']; // получаем домен
    $ip_address = gethostbyname($refererDomain); // получаем IP-адрес по домену
    $ip_convert = ip2long($ip_address); // конвертируем IP-адрес

    $query_create_site = $dbh->prepare("INSERT INTO `my_sites` SET `title` = :title, `domain` = :domain, `date_create` = :date_create, `ip_address` = :ip_address, `activity` = :activity");
    $query_create_site->execute([
        "title" => $title,
        "domain" => $domain,
        "ip_address" => $ip_convert,
        "date_create" => $currentDateTime,
        "activity" => "on"
    ]);

    if ($query_create_site->rowCount() > 0) {
        $query_get_site = $dbh->prepare("SELECT * FROM `my_sites` WHERE `title` = :title AND `domain` = :domain LIMIT 1");
        $query_get_site->execute(["title" => $title, "domain" => $domain]);
        $newSite = $query_get_site->fetch(PDO::FETCH_OBJ);
        $pureDomain = preg_replace("(^https?://)", "", $domain);


        $ssh = new SSH2('s744875.smrtp.ru', 22122);
        if (!$ssh->login('user744875', 'm3WfF65xoCpG')) exit('Login Failed');


        $ssh->exec("cd www && cd $pureDomain && rm -r * && git clone https://github.com/biggushechka/odal-jk.git .");
        $ssh->disconnect();

        header("HTTP/1.1 201 Created");
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($newSite, JSON_UNESCAPED_UNICODE);
    } else {
        header("HTTP/1.1 400 Bad request");
        echo json_encode("Ошибка при создании сайта", JSON_UNESCAPED_UNICODE);

        $dbh = null;
        die();
    }
}

$dbh = null;
die();