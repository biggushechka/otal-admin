<?php

$v = "";
$root = $_SERVER['DOCUMENT_ROOT'];

if ($_SERVER['HTTP_HOST'] == 'odal-admin') {
    $v = mt_rand(10000, 99999999);
} else {
    $v = "1.01.070";
}

?>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>ODAL-admin</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="version" content="<?=$v?>">

    <!-- Favicons -->
    <link rel="shortcut icon" href="/static/favicon.svg">
    <link rel="icon" href="/static/favicon.svg?v=1.02">
    <link rel="apple-touch-icon" href="/static/favicon.svg">
    <link rel="mask-icon" href="/static/favicon.svg">

    <style>
        body {
            font-family: Arial;
        }
    </style>

</head>
<body>
    <main id="app"></main>

    <script src="/assets/js/functions.js?v=<?=$v?>"></script>
    <script src="/assets/js/scripts.js?v=<?=$v?>"></script>
    <script src="/assets/js/router.js?v=<?=$v?>"></script>
</body>
</html>