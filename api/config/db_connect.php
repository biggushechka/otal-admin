<?php

$rootPath = $_SERVER['DOCUMENT_ROOT'];

$dbhost = "novato1v.beget.tech";
$dbuser = "novato1v_otales";
$dbpass = "7HASCI&w";
$dbname = "novato1v_otales";

try {
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    print "ERROR!!!!!!!!!!!: " . $e->getMessage();
    die();
}