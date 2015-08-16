<?php
    echo 'json written to data.json';

    $newJsonString = json_encode(json_decode(file_get_contents("php://input")));
    $file = fopen('data.json','w+');
    fwrite($file, $newJsonString);
    fclose($file);
?>