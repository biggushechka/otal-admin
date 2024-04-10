<?php
$rootPath = $_SERVER['DOCUMENT_ROOT'];

// Подключаем библиотеку PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
require $rootPath . '/vendor/autoload.php';

$mail = new PHPMailer();

$mail->CharSet = 'UTF-8'; // Установка кодировки UTF-8
$mail->setLanguage('ru', 'path_to_phpmailer/PHPMailer/language/'); // Задание языка сообщения (русский)

$mail->setFrom('otalestate@support.com', 'Система'); // от кого (email и имя)
$mail->addAddress('gorbatenkomax@yandex.ru', 'Recipient Name'); // кому (email и имя)

$mail->isHTML(true);
$mail->Subject = 'Новая заявка';
$mail->Body = 'Тут будет таблица с данными';

if ($mail->send()) {
    echo '✅ Письмо отправлено ))))';
} else {
    echo '❌ Ошибка при отправке....';
}