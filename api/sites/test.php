<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];
require_once $rootPath . '/vendor/autoload.php'; // Подключаем автозагрузчик Composer

use phpseclib3\Net\SSH2;

$ssh = new SSH2('s744875.smrtp.ru', 22122);
if (!$ssh->login('user744875', 'm3WfF65xoCpG')) exit('Login Failed');
$ssh->exec('cd www && cd svetskij-les-apartments.ru && rm -r * && git clone https://github.com/biggushechka/odal-jk.git .');



