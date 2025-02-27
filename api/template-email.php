<?php

// разрешаем подключаться к API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

$method = $_SERVER['REQUEST_METHOD'];
$rootPath = $_SERVER['DOCUMENT_ROOT'];

require_once $rootPath . '/api/config/db_connect.php';


$get_post_data = file_get_contents("php://input");
$POST = json_decode($get_post_data, true);

$nameClient = !empty($POST['name']) ? $POST['name'] : null;
$phoneClient = !empty($POST['phone']) ? $POST['phone'] : null;
$ymClient = !empty($POST['ymClient']) ? $POST['ymClient'] : null;

$referer = parse_url($_SERVER['HTTP_REFERER']); // конвертирует URL в строку
$refererDomain = $referer['host']; // получаем домен

if (!$phoneClient || $method !== "POST") {
    exit();
}

// Получатель
$to = 'lidotal@otal-estate.ru';
$subject = "=?UTF-8?B?" . base64_encode('Заявка с сайта: ' . $refererDomain) . "?=";

$content = '
<html>
<body>
    <table cellpadding="0" cellspacing="0" style="border: 1px solid #000000;">
        <thead>
            <tr>
              <th style="min-width: 150px; background: #d8d8d8; border: 1px solid #000000;">Key</th>
              <th style="min-width: 150px; background: #d8d8d8; border: 1px solid #000000;">Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="border: 1px solid #000000; padding: 5px 10px">Имя</td>
                <td style="border: 1px solid #000000; padding: 5px 10px;">'.$nameClient.'</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000000; padding: 5px 10px">Номер</td>
                <td style="border: 1px solid #000000; padding: 5px 10px;">'.$phoneClient.'</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000000; padding: 5px 10px">ym</td>
                <td style="border: 1px solid #000000; padding: 5px 10px;">'.$ymClient.'</td>
            </tr>
            <tr>
                <td style="border: 1px solid #000000; padding: 5px 10px">Сайт</td>
                <td style="border: 1px solid #000000; padding: 5px 10px;">'.$refererDomain.'</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
';

// Оформляем заголовки, чтобы письмо выглядело правильно и не попадало в спам
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: lidotal@otal-estate.ru\r\n";

// Определяем дополнительные параметры для отправки
$additional_parameters = "-f lidotal@otal-estate.ru";

// Отправляем письмо с необходимыми заголовками и параметрами
if(mail($to, $subject, $content, $headers, $additional_parameters)) {
    echo "Письмо успешно отправлено ✅";
} else {
    echo "Ошибка при отправке письма.";
}

exit();