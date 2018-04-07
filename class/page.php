<?php
class page{
	
	public function __construct($total, $offset, $limit, $nb){
		$this->total=$total;
		$this->offset=$offset;
		$this->limit=$limit;
		$this->nb=$nb;
		$this->nb_page = ceil($this->total/$this->limit);
		$this->page=ceil($this->offset/$this->limit)+1;
	}
	
	public function listPage(){
		
		$list_page = array();
		
		for($i=1; $i <= $this->nb_page; $i++){
			if(($i <= $this->nb) OR ($i > $this->nb_page - $this->nb) OR (($i < $this->page + $this->nb) AND ($i > $this->page-$this->nb))){
				$list_page[] = array(
					'num' => $i,
					'nom' => $i
				);
			}
			else{
				if ($i >= $this->nb AND $i <= $this->page - $this->nb){
					$i = $this->page - $this->nb;
					$num = ceil(($this->page-($this->nb-3))/2);
				}
				elseif ($i >= $this->page + $this->nb AND $i <= $this->nb_page - $this->nb){
					$i = $this->nb_page - $this->nb;
					$num = ceil(((($this->nb_page-($this->nb-2))-$this->page)/2)+$this->page);
				}
				
				$list_page[] = array(
					'num' => $num,
					'nom' => '...'
				);
			}
		}
		
		return $list_page;
	}
	
	public function pagePrec(){
		
		if($this->offset >= $this->limit){
			
			$i = $this->page-1;
			
			$nom='<<';
			
			$array = array(
				'num' => $i,
				'nom' => $nom
			);
			
			return $array;
		}
	}
	
	public function pageSuiv(){
		
		if($this->page != $this->nb_page){
			
			$i = $this->page+1;
			
			$nom='>>';
			
			$array = array(
				'num' => $i,
				'nom' => $nom
			);
			
			return $array;
		}
	}
}