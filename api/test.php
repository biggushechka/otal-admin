<?php
$rootPath = $_SERVER['DOCUMENT_ROOT'];


// Подключаем библиотеку PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require $rootPath . '/vendor/autoload.php';

$mail = new PHPMailer();
$mail->setFrom('otalestate@support.com', 'Система'); // от кого (email и имя)
$mail->addAddress('gorbatenkomax@yandex.ru', 'Recipient Name'); // кому (email и имя)

$mail->isHTML(true);
$mail->Subject = 'Subject';
$mail->Body = 'Message body';

if ($mail->send()) {
    echo '✅ Письмо отправлено ))))';
} else {
    echo '❌ Ошибка при отправке....';
}