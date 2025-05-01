<?php

define("HOSTNAME", "localhost");
define("USERNAME", "root");
define("PASSWORD", "");
define("DATABASE", "clinic_system");

$mysqli = mysqli_connect(HOSTNAME, USERNAME, PASSWORD, DATABASE);

$status = "";
$connected = false;

if(!$mysqli){
    $status = "Disconnected";
    $connected = false;
} else {
    $status = "Connected";
    $connected = true;
}
?>