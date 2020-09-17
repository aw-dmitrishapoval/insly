<?php

$name = 'Job seeker';

while($name) {
    echo $name[0];
    $name = substr($name, 1);
}
