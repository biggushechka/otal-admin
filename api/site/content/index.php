<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
require_once $rootPath . '/api/config/db_connect.php';
require_once $rootPath . '/api/config/allowedOrigins.php';

//$ip = gethostbyname($domain);
//$ip_orig = ip2long($ip);
//$ip_decod = long2ip($ip_orig);

//echo "IP-адрес сайта (orig): $ip_orig <br>";
//echo "IP-адрес сайта (decod): $ip_decod";


//if(isset($_SERVER['HTTP_REFERER'])) {
//    $referer = parse_url($_SERVER['HTTP_REFERER']);
//    $refererDomain = $referer['host'];
//
//    // Выполните необходимые действия на основе значения $refererDomain
//    echo "Запрос был отправлен с домена: " . $refererDomain;
//} else {
//    // Обработка случая, когда запрос не содержит HTTP_REFERER
//    echo "HTTP_REFERER не определен";
//}