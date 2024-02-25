<?php
global $version;
$root = $_SERVER['DOCUMENT_ROOT'];
require_once $root . '/backend/template.php';
?>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>OTAL-Admin</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="version" content="<?= $version ?>">


    <!-- Favicons -->
    <link rel="shortcut icon" href="/static/favicon.png">
    <link rel="icon" href="/static/favicon.png">
    <link rel="apple-touch-icon" href="/static/favicon.png">
    <link rel="mask-icon" href="/static/favicon.png">

    <!-- Style -->
    <link rel="stylesheet" href="/css/global.css?v=<?= $version ?>">

    <link rel="stylesheet" href="/plugins/highlight/styles/atom-one-dark.min.css">
    <script src="/plugins/highlight/highlight.min.js"></script>

</head>
<body>
<main id="app"></main>


<script src="https://api-maps.yandex.ru/2.1/?apikey=ac7c6d4c-48ca-4019-af05-4911f2b78b9b&lang=ru_RU" type="text/javascript"></script>
<script src="/plugins/uikit/uikit.min.js"></script>
<script src="/assets/icons/index.js"></script>
<script src="/plugins/modal/modal.js?v=<?= $version ?>"></script>
<script src="/plugins/splide/splide.js"></script>
<script src="/plugins/imask/imask.js"></script>
<script src="/plugins/choices-select/choices.min.js"></script>
<script src="/plugins/form-fields/form-fields.js?v=<?= $version ?>"></script>

<script src="/js/functions.js?v=<?= $version ?>"></script>
<script src="/js/scripts.js?v=<?= $version ?>"></script>
<script src="/js/router.js?v=<?= $version ?>"></script>

</body>
</html>