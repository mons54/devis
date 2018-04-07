<?php
$classDevis = new devis();

$limit=20;

$search = !empty($_POST['search'] ? (string) $_POST['search'] : null;

if(!empty($_POST['page']))
	$page=(int) $_POST['page'];
else
	$page = 1;
	
if($page==0)
	$page=1;
	
$offset=($page*$limit)-$limit;

echo json_encode($classDevis->listerDevis($page, $offset, $limit, $search));