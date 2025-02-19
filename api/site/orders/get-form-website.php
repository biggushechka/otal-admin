<?php

// разрешаем подключаться к API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$rootPath = $_SERVER['DOCUMENT_ROOT'];
$method = $_SERVER['REQUEST_METHOD'];
$refererDom = $_SERVER['HTTP_REFERER'];

require_once $rootPath . '/api/config/db_connect.php';
use PHPMailer\PHPMailer\PHPMailer;
require $rootPath . '/vendor/autoload.php';

$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$id_site = 0;
$type = (isset($POST["type"]) === true) ? $POST["type"] : "";
$name = (isset($POST["name"]) === true) ? $POST["name"] : "не указано";
$phone = (isset($POST["phone"]) === true) ? $POST["phone"] : "не указан";
$client_email = (isset($POST["email"]) === true) ? $POST["email"] : "не указано";
$comment = (isset($POST["comment"]) === true) ? $POST["comment"] : "не указан";
$currentDateTime = date('Y-m-d H:i:s');

if (isset($refererDom)) {
    $referer = parse_url($_SERVER['HTTP_REFERER']); // конвертирует URL в строку
    $refererDomain = $referer['host']; // получаем домен
    $ip_address = gethostbyname($refererDomain); // получаем IP-адрес по домену
    $ip_convert = ip2long($ip_address); // конвертируем IP-адрес

    // получение сайта
    $getSite = $dbh->prepare("SELECT * FROM `my_sites` WHERE `domain` = :domain LIMIT 1");
    $getSite->execute(["domain" => "https://$refererDomain"]);

    if ($getSite->rowCount() > 0) {
        $site = $getSite->fetch(PDO::FETCH_OBJ);
        $id_site = $site->id;
    } else {
        $dbh = null;
        header("HTTP/1.1 403 Forbidden");
        exit("Доступ запрещен-1 (( $refererDomain");
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $query_add = $dbh->prepare("INSERT INTO `site_orders` SET
        `id_site` = :id_site,
        `type` = :type,
        `name` = :name,
        `phone` = :phone,
        `email` = :email,
        `comment` = :comment,
        `date_create` = :date_create
    ");

    $query_add->execute([
        "id_site" => $id_site,
        "type" => $type,
        "name" => $name,
        "phone" => $phone,
        "email" => $client_email,
        "comment" => $comment,
        "date_create" => $currentDateTime
    ]);

    if ($query_add->rowCount() > 0) {
        sendMail();
        sendTelegram();
    }
}

function sendTelegram() {
    global $dbh, $id_site, $refererDom, $phone, $type, $name, $client_email;

    $botToken = '6992664105:AAGlVd1qXIqcUpZEXCcfF1qFI-Z3i32vWz0';
    $message = "Новая заявка ($refererDom)\n\nТип: *$type*;\nИмя: *$name*;\nТелефон: *$phone*;\nE-Mail: *$client_email*;";

    $query_get_tg = $dbh->prepare("SELECT `tg_chad_id` FROM `site_orders_source_telegram` WHERE `id_site` = :id_site");
    $query_get_tg->execute(["id_site" => $id_site]);

    if ($query_get_tg->rowCount() > 0) {
        $getSours = $query_get_tg->fetchAll(PDO::FETCH_ASSOC);

        // Проходим по каждому email и добавляем его как получателя
        foreach ($getSours as $source) {
            // Отправляем POST-запрос на API Telegram для отправки сообщения
            $url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage';
            $data = array('chat_id' => $source['tg_chad_id'], 'text' => $message, 'parse_mode' => 'Markdown');
            $options = array(
                'http' => array(
                    'method'  => 'POST',
                    'header'  => 'Content-type: application/x-www-form-urlencoded',
                    'content' => http_build_query($data)
                )
            );
            $context  = stream_context_create($options);
            $result = file_get_contents($url, false, $context);
        }
    }
}

function sendMail() {
    global $dbh, $id_site, $refererDom, $phone, $type, $name, $client_email;
    $mail = new PHPMailer();

    $mail->CharSet = 'UTF-8'; // Установка кодировки UTF-8
    $mail->setLanguage('ru', 'path_to_phpmailer/PHPMailer/language/'); // Задание языка сообщения (русский)

    $mail->setFrom('otalestate@support.com', 'Система'); // от кого (email и имя)

    $query_get_emails = $dbh->prepare("SELECT `email` FROM `site_orders_source_email` WHERE `id_site` = :id_site");
    $query_get_emails->execute(["id_site" => $id_site]);

    if ($query_get_emails->rowCount() > 0) {
        $emails = $query_get_emails->fetchAll(PDO::FETCH_ASSOC);

        // Проходим по каждому email и добавляем его как получателя
        foreach ($emails as $email) {
            $mail->addAddress($email['email'], 'Recipient Name'); // кому (email и имя)
        }
    }


    $mail->isHTML(true);
    $mail->Subject = "Новая заявка ($refererDom)";
    $mail->Body = '
    <table style="border: 1px solid #000; border-collapse: collapse;">
        <tbody>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">Тип</td>
                <td style="border: 1px solid #000; padding: 5px;">'.$type.'</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">Имя</td>
                <td style="border: 1px solid #000; padding: 5px;">'.$name.'</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">Телефон</td>
                <td style="border: 1px solid #000; padding: 5px;">'.$phone.'</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">E-Mail</td>
                <td style="border: 1px solid #000; padding: 5px;">'.$client_email.'</td>
            </tr>
        </tbody>
    </table>';

    if (!$mail->send()) {
        echo '❌ Ошибка при отправке....';
    }
}