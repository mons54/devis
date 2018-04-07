<?php
$classDevis = new devis();
echo json_encode($classDevis->selectionnerDevis((int) $_POST['id']));