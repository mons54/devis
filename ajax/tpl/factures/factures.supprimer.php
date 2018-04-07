<?php
$classFactures = new factures();
echo $classFactures->supprimerFactures((int) $_POST['id']);