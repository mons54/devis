<?php

@include '__system/db.conf.php';

class db {
	
	protected $bdd;
	protected $sql;
	protected $exe;
	
	public function __construct() {
		
		try{
			$this->bdd = new PDO(
			'mysql:host=host;dbname=dbname', 'user', 'password',
			array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
			);
			$this->bdd->setAttribute( PDO::ATTR_ERRMODE ,PDO::ERRMODE_SILENT);
		}
		catch (PDOException $e){
			return $e->getMessage();
		}
	}
	
	protected function fetch() {
		$retour = $this->bdd->prepare($this->sql);
		$retour->execute(@$this->exe);
		return $retour->fetch(PDO::FETCH_OBJ);
	}
	
	protected function fetchAll() {
		$retour = $this->bdd->prepare($this->sql);
		$retour->execute(@$this->exe);
		return $retour->fetchAll(PDO::FETCH_OBJ);
	}
	
	protected function rowCount() {
		$retour = $this->bdd->prepare($this->sql);
		$retour->execute(@$this->exe);
		return $retour->rowCount();
	}
	
	protected function exec() {
		$retour = $this->bdd->prepare($this->sql);
		$retour->execute(@$this->exe);
	}
}