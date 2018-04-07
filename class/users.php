<?php

@session_start();

class users extends db {

	public function getUserConnect() {
		return !empty($_SESSION['user']);
	}
	
	public function hacherMotDePasse($mdp){
		@define("PREFIXE", "ftyuio79g71adf");
		@define("SUFFIXE", "46fglp46a22dr5");
		return md5(sha1(PREFIXE) . $mdp . sha1(SUFFIXE));
	}
	
	public function changerMotDePasse($post) {
		
		$mdp = $this->hacherMotDePasse($post['actuel']);
		
		unset($this->exe);
		$this->sql = 'SELECT mdp FROM societe';
		$this->exec();
		$data = $this->fetch();
		
		if(!empty($post['nouveau']) && $mdp == $data->mdp) {
			unset($this->exe);
			$this->exe['mdp'] = $this->hacherMotDePasse($post['nouveau']);
			$this->sql = 'UPDATE societe SET mdp = :mdp';
			$this->exec();
			return true;
		}
		
		return false;
	}
	
	public function connexion($mdp) {
		
		if(isset($_SESSION['connexion']) && $_SESSION['connexion'] >= 10)
			return 'connexion';
		
		$mdp = $this->hacherMotDePasse($mdp);
		
		unset($this->exe);
		$this->sql = 'SELECT mdp FROM societe';
		$this->exec();
		$data = $this->fetch();
		
		if($mdp == $data->mdp) {
			$_SESSION['user'] = true;
			$_SESSION['connexion'] = 0;
		}
		else {
			if(!isset($_SESSION['connexion']))
				$_SESSION['connexion'] = 0;
			else
				$_SESSION['connexion']++;
				
			return 'mdp';
		}
	}
}