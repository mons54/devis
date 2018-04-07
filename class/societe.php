<?php
class societe extends db{
	
	public function selectionnerSociete() {
		unset($this->exe);
		$this->sql = 'SELECT * FROM societe';
		$this->exec();
		$data = $this->fetch();
		return $data;
	}
	
	public function modifierSociete($post) {
		
		unset($this->exe);
		
		foreach($post as $key => $value)
			$this->exe[$key] = $value;	
		
		$this->sql = 'UPDATE societe SET nom = :nom, adresse = :adresse, ville = :ville, cp= :cp, tel = :tel, email = :email, url = :url, siret = :siret';
		$this->exec();
		
		return true;
	}
}