<?php
$classFactures = new factures();
echo json_encode($classFactures->selectionnerFactures((int) $_POST['id']));