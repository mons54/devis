<?php

require __DIR__.'/../vendor/autoload.php';

use Spipu\Html2Pdf\Html2Pdf;

$id = (int) $_GET['id'];

if(!empty($id)) {
	function charge($class){
		require_once '../class/'.$class.'.php';
	}
	spl_autoload_register('charge');
	
	ob_start();

	$classSociete = new societe();
	
	$societe = $classSociete->selectionnerSociete();
	
	$classDevis = new devis();
	
	$data = $classDevis->selectionnerDevis($id);
	?>

	<link rel="stylesheet" href="print.css" type="text/css">

	<page  backtop="75mm" backbottom="20mm" backleft="10mm" backright="10mm">
		<page_header>
			<div id="header">
				<div class="logo"><img src="../img/logo.png" /></div>
				<div class="adresse">
					<?php echo $societe->nom; ?>
					<br/><?php echo $societe->tel; ?>
					<br/><?php echo $societe->email; ?>
					<br/><?php echo $societe->url; ?>
				</div>
				<div class="date">
					<?php echo $data['data']->date; ?>
					<br/><strong>Devis</strong> n° <?php echo $id; ?>
				</div>
				<div class="client">
					<?php 
					if(!empty($data['data']->client_societe)) echo '<br/>'.$data['data']->client_societe;
					if(!empty($data['data']->client_nom)) echo '<br/>'.$data['data']->client_nom;
					if(!empty($data['data']->client_adresse)) echo '<br/>'.nl2br($data['data']->client_adresse);
					if(!empty($data['data']->client_cp) || !empty($data['data']->client_ville)) echo '<br/>'.$data['data']->client_cp.' '.$data['data']->client_ville;
					?>
				</div>
			</div>
		</page_header>
		<page_footer>
			<div id="footer">
				<div class="societe">
					<strong><?php echo $societe->nom; ?></strong> - 
					<?php echo $societe->adresse. ' '.$societe->cp.' '.$societe->ville; ?> -
					<strong>SIRET</strong> : <?php echo $societe->siret; ?>
				</div>
			</div>
		</page_footer>
		<table>
			<tr>
				<th class="center quantite">QUANTITÉ</th>
				<th class="description">DÉSIGNATION</th>
				<th class="center prix">PRIX UNITAIRE</th>
				<th class="center montant">PRIX TOTAL</th>
			</tr>
			<?php
			$total = 0;
			foreach($data['contenu'] as $contenu) {
				?>
				<tr>
					<td class="center quantite"><?php echo $contenu->quantite; ?></td>
					<td class="description"><pre><?php echo $contenu->description; ?></pre></td>
					<td class="center prix"><?php echo $contenu->pu; ?> €</td>
					<td class="center montant"><?php echo $contenu->montant; ?> €</td>
				</tr>
				<?php
				
				$total += (float)  $contenu->montant;
			}
			?>
			<tfoot>
				<tr>
					<th colspan="3" class="total">TOTAL HT</th>
					<th class="center montant"><b><?php echo sprintf('%.2f', $total); ?> €</b></th>
				</tr>
			</tfoot>
		</table>
		<p>TVA Non applicable, art. 293 B du CGI</p>
		<p id="signature">
			<div class="left"><?php echo $societe->nom; ?></div>
			<div class="right"><?php echo $data['data']->client; ?></div>
		</p>
		
	</page>

	<?php
	$html2pdf = new Html2Pdf();
	$html2pdf->writeHTML(ob_get_clean());
	$html2pdf->output('devis-' . $id. '.pdf');
}

