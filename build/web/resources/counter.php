<?php
    $counter = file_get_contents("php://input");
    $file = fopen('counter.txt','w+');
    fwrite($file, $counter);
    fclose($file);
?>