<?php

DEFINE ("PATH", "http://".$_SERVER['HTTP_HOST'].substr($_SERVER['PHP_SELF'],0,strrpos($_SERVER['PHP_SELF'], '/')));

function charge($class) {
	require_once 'class/'.$class.'.php';
}

spl_autoload_register('charge');

$classUser = new users();

if($classUser->getUserConnect())
	require 'contenu.php';
else 
	require 'connexion.php';