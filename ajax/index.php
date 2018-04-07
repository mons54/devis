<?php

function charge($class){
	require_once '../class/'.$class.'.php';
}
spl_autoload_register('charge');

$classUser = new users();
if(!$classUser->getUserConnect())
	die;
	
$get = @explode('/', $_GET['get']);
	
$dir = '';
foreach($get as $_get) {
	$dir .= '/'.$_get;
	if(file_exists('tpl'.$dir.'.php')) {
		require 'tpl'.$dir.'.php';
		break;
	}
}