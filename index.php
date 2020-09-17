<?php

ini_set('precision', 14);
ini_set('serialize_precision', 14);
require_once __DIR__ . ('../app/controller.php');

$controller = new App\Controller();
$controller->dispatch();
