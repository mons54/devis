<?php

class client extends db{

	public function ajouterClient($post) {
		
		if(empty($post['societe']) && empty($post['nom']))
			return false;
		
		unset($this->exe);
				
		$this->exe = array(
			'societe' => $post['societe'],
			'nom' => $post['nom'],
			'prenom' => $post['prenom'],
			'adresse' => $post['adresse'],
			'cp' => $post['cp'],
			'ville' => $post['ville'],
		);
		
		if(empty($post['id'])) {
			$this->sql = 'INSERT INTO clients VALUES ("", :societe, :nom, :prenom, :adresse, :cp, :ville)';
			$this->exec();
			$id = $this->bdd->lastInsertId();
		}
		else {
			$id = (int) $post['id'];
			$this->sql = 'UPDATE clients SET societe = :societe, nom = :nom, prenom = :prenom, adresse= :adresse, cp = :cp, ville = :ville WHERE id ='.$id;
			$this->exec();
		}
		
		return true;
	}
	
	public function listerClient($page, $offset, $limit) {
		unset($this->exe);
		$this->sql = 'SELECT * FROM clients ORDER BY societe, nom';
		$this->exec();
		return $this->fetchAll();
	}
	
	public function rechercherClient($data) {
		
		unset($this->exe);
		
		$this->exe['data'] = '%'.$data.'%';
			
		$this->sql = 'SELECT * FROM clients WHERE societe LIKE :data OR nom LIKE :data ORDER BY societe, nom LIMIT 0,20';
		$this->exec();
		$data = $this->fetchAll();
		
		return $data;
	}
	
	public function supprimerClient($id) {
		
		if(empty($id))
			return false;
		
		unset($this->exe);
		$this->exe['id'] = $id;
		$this->sql = 'DELETE FROM clients WHERE id = :id';
		$this->exec();
		
		return $id;
	}
}