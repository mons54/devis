<?php
$classClient = new client();
echo json_encode($classClient->rechercherClient($_POST['data']));