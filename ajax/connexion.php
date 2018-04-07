<?php
function charge($class){
	require_once '../class/'.$class.'.php';
}
spl_autoload_register('charge');

$classUser = new users();

if(!empty($_POST['password']) && !$classUser->getUserConnect())
	echo $classUser->connexion($_POST['password']);