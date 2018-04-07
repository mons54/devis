<?php

class devis extends client {

	public function ajouterDevis($post) {
		
		if(empty($post['client']))
			return false;
			
		unset($this->exe);
			
		$this->exe = array(
			'client' => $post['client'],
			'timestamp' => time(),
		);
		
		$this->exe['client'] = (int) $post['client'];
		
		if(empty($post['id'])) {
			
			$this->sql = 'INSERT INTO devis VALUES ("", :client, :timestamp)';
			$this->exec();
			
			$id = $this->bdd->lastInsertId();
		}
		else {
		
			$id = (int) $post['id'];
			
			$this->sql = 'UPDATE devis SET client = :client, timestamp = :timestamp WHERE id ='.$id;
			$this->exec();
			
			$this->sql = 'DELETE FROM devis_contenu WHERE devis ='.$id;
			$this->exec();
		}
			
		foreach($post['contenu'] as $key => $value) {
		
			if(!empty($value['quantite'])
				|| !empty($value['description'])
				|| !empty($value['prix_unitaire'])
				|| !empty($value['montant'])
				){
				
				unset($this->exe);
				
				$this->exe = array(
					'quantite' => $value['quantite'],
					'description' => $value['description'],
					'pu' => $value['pu'],
					'montant' => $value['montant']
				);
				
				$this->sql = 'INSERT INTO devis_contenu VALUES ("", '.$id.', :quantite, :description, :pu, :montant)';
				$this->exec();
			}
		}
		
		return true;
	}
	
	public function listerDevis($page, $offset, $limit, $search = null) {
		
		unset($this->exe);

		$this->sql = '
			SELECT d.id id, FROM_UNIXTIME(d.timestamp,"%d/%m/%Y") date, 
			IF(c.societe != "", concat(c.societe, " - ", c.nom, " ", c.prenom), concat(c.nom, " ", c.prenom)) client 
			FROM devis d
			LEFT JOIN clients c
			ON d.client = c.id
		';

		if ($search) {
			$this->sql .= ' WHERE c.nom LIKE "%' . mysql_escape_string($search) . '%" OR c.prenom LIKE "%' . mysql_escape_string($search) . '%"';
		}
			
		$this->sql .= ' ORDER BY d.id DESC';
		$this->exec();
		$total=$this->rowCount();

		if ($search) {
			$this->sql.=' LIMIT 200';
		} else {
			$this->sql.=' LIMIT '.$offset.', '.$limit;
		}
		$this->exec();
		$data = $this->fetchAll();
		
		$array = array();
		
		if($total > $limit){
		
			$nb=3;
			
			$_page=new page($total, $offset, $limit, $nb);
			
			$array = array(
				'page' => $page,
				'listPage' => $_page->listPage(),
				'pageSuiv' => $_page->pageSuiv(),
				'pagePrec' => $_page->pagePrec()
			);
		}
		
		$array = array(
			'data' => $data,
			'page' => $array
		);
		
		return $array;
	}
	
	public function selectionnerDevis($id) {
		
		unset($this->exe);
			
		$this->sql = '
			SELECT c.id id,
			FROM_UNIXTIME(d.timestamp,"%d/%m/%Y") date,
			IF(c.societe != "", c.societe,c.nom) client,
			concat(c.nom, " ", c.prenom) client_nom,
			c.societe client_societe,
			c.adresse client_adresse,
			c.cp client_cp,
			c.ville client_ville
			FROM devis d
			LEFT JOIN clients c
			ON d.client = c.id
			WHERE d.id ='.$id;
		$this->exec();
		
		$data = $this->fetch();
		
		unset($this->exe);
			
		$this->sql = '
			SELECT * FROM devis_contenu
			WHERE devis ='.$id.'
			ORDER BY id';
		$this->exec();
		
		$contenu = $this->fetchAll();
		
		$array = array(
			'data' => $data,
			'contenu' => $contenu
		);
		
		return $array;
	}
	
	public function supprimerDevis($id) {
		
		if(empty($id))
			return false;
			
		unset($this->exe);
			
		$this->sql = 'DELETE FROM devis WHERE id ='.$id;
		$this->exec();
		
		unset($this->exe);
			
		$this->sql = 'DELETE FROM devis_contenu WHERE devis ='.$id;
		$this->exec();
		
		return $id;
	}
	
	public function facturerDevis($id) {
		
		unset($this->exe);
		
		$this->sql = 'INSERT INTO factures (client) SELECT client FROM devis WHERE id ='.$id;
		$this->exec();
		
		$id_facture = $this->bdd->lastInsertId();
		
		$this->exe['timestamp'] = time();
		$this->sql = 'UPDATE factures SET timestamp = :timestamp WHERE id ='.$id_facture;
		$this->exec();
		
		$this->sql = 'INSERT INTO factures_contenu (factures, quantite, description, pu, montant) SELECT devis, quantite, description, pu, montant FROM devis_contenu WHERE devis ='.$id.' ORDER BY id';
		$this->exec();
		
		$this->sql = 'UPDATE factures_contenu SET factures='.$id_facture.' WHERE factures ='.$id;
		$this->exec();
		
		return $id_facture;
	}
}