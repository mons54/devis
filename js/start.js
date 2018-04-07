$(document).ready(function() {
	$._start();
});

(function($){
	
	$.extend({
	
		options: {
			
			element: 'body',
			post: {},
			menu: {
				modifierSociete: "Modifier Société",
				ajouterClient: "Ajouter client",
				listerClient: "Lister clients",
				ajouterDevis: "Ajouter devis",
				listerDevis: "Lister devis",
				ajouterFactures: "Ajouter facture",
				listerFactures: "Lister factures",
			},
		},
		
		_start: function() {
		
			var that = this;
			
			that.header = $('<header></header').appendTo(that.options.element);
			
			$('<img id="logo" src="img/logo.png" />').appendTo(that.header);
			$('<h1>Devis et Factures</h1>').appendTo(that.header);
			$('<a id="deconnexion" href="deconnexion.php">Déconnexion</a>').appendTo(that.header);
			$('<button id="changer-mdp">Changer de mot de passe</button>').appendTo(that.header)
			.click(function() {
				var fenetre = $('<div class="fenetre"></div>').appendTo(that.header);
				
				$('<button class="close">X</button>').appendTo(fenetre)
				.click(function() {
					$(fenetre).remove();
				});
				
				var form = $('<div class="form"></div>').css({'display':'block', 'margin-bottom':'10px'}).appendTo(fenetre);
				$('<label>Mot de passe actuel</label>').appendTo(form);
				that.options.post.mdp_actuel = $('<input type="password" value="">').appendTo(form);
				
				var form = $('<div class="form"></div>').css({'display':'block', 'margin-bottom':'10px'}).appendTo(fenetre);
				$('<label>Nouveau mot de passe</label>').appendTo(form);
				that.options.post.mdp_nouveau = $('<input type="password" value="">').appendTo(form);
				
				var form = $('<div class="form"></div>').css({'display':'block', 'margin-bottom':'10px'}).appendTo(fenetre);
				$('<label>Répéter mot de passe</label>').appendTo(form);
				that.options.post.mdp_repeter = $('<input type="password" value="">').appendTo(form);
				
				var form = $('<div class="form"></div>').css({'display':'block', 'margin-top':'30px'}).appendTo(fenetre);
				$('<button type="submit">Envoyer</button>').appendTo(form)
				.click(function() {
				
					if(that.message)
						$(that.message).remove();
					
					if(!$(that.options.post.mdp_actuel).val() || !$(that.options.post.mdp_nouveau).val() || !$(that.options.post.mdp_repeter).val()) {
						that.message = $('<p>Tous les champs doivent être remplis</p>').css({'color':'#930', 'margin':'10px', 'font-weight':'bold'}).appendTo(fenetre);
						return;
					}
						
					if($(that.options.post.mdp_nouveau).val() != $(that.options.post.mdp_repeter).val()) {
						that.message = $('<p>Les mots de passe ne sont pas identiques</p>').css({'color':'#930', 'margin':'10px', 'font-weight':'bold'}).appendTo(fenetre);
						return;
					}
						
					var post = {
						actuel: $(that.options.post.mdp_actuel).val(),
						nouveau:$(that.options.post.mdp_nouveau).val(),
						repeter:$(that.options.post.mdp_repeter).val(),
					};
					
					$.post('ajax/mdp/mdp.modifier', post, function(data) {
						if(data) {
							that.message = $('<p>Mot de passe modifié</p>').css({'color':'#930', 'margin':'10px', 'font-weight':'bold'}).appendTo(fenetre);
							$(that.options.post.mdp_actuel).val('');
							$(that.options.post.mdp_nouveau).val('');
							$(that.options.post.mdp_repeter).val('')
						}
						else {
							that.message = $('<p>Mot de passe actuel non valide</p>').css({'color':'#930', 'margin':'10px', 'font-weight':'bold'}).appendTo(fenetre);
						}
					});
				});
			});
			
			that.menu = $('<section id="menu"></section>').appendTo(that.options.element);
			that.content = $('<section id="content"></section>').appendTo(that.options.element);
			
			that.ul = $('<ul id="menu"></ul>').appendTo(that.menu);
			
			for(var menu in that.options.menu)
				that._change_menu(menu);
				
			$('#menu li a').removeClass('select');
			$('.modifierSociete').addClass('select');
			$(that.content).empty().html();
			$(that.content).modifierSociete({data:false});
		},
		
		_change_menu: function(menu) {
			var that = this,
				li = $('<li></li>').appendTo(that.ul);
				
			$('<a href="#" class="' + menu + '">' + that.options.menu[menu] + '</a>').appendTo(li)
			.click(function() {
				$('#menu li a').removeClass('select');
				$(this).addClass('select');
				$(that.content).empty().html();
				$(that.content)[menu]({data:false});
			});
			
			
		},
		
		_ajouter_document: function() {
			
			var that = this;
			
			that.options.post = {
				contenu: {},
			};
			
			var form_client = $('<div class="form" style="width: 700px;"></div>').appendTo(that.element);
			
			$('<label>Client</label>').appendTo(form_client);
			this.options.client = $('<select width="100%"></select>').appendTo(form_client);
			$.post('ajax/client/client.lister', function(data) {
				$.each(data, function (key, value) {
					$('<option value="' + value.id + '">' + (value.societe ? (value.societe + ' - ') : "") + (value.nom ? value.nom : "") + '</option>').appendTo(this.options.client);
				}.bind(this));
			}.bind(this), "json");
			
			var table = $('<table class="contenu-devis"></table>').appendTo(that.element);
			
			var thead = $('<thead></thead>').appendTo(table);
			
			var tr = $('<tr></tr>').appendTo(thead);
			$('<th class="quantite">Quantité</th>').appendTo(tr);
			$('<th class="description">Description</th>').appendTo(tr);
			$('<th class="pu">Prix Unitaire</th>').appendTo(tr);
			$('<th class="montant">Montant</th>').appendTo(tr);
			
			that.table = $('<tbody></tbody>').appendTo(table);
			
			if(that.options.data && that.options.data % 1 === 0) {
				$.post('ajax/' + that.options.document + '/' + that.options.document + '.selectionner', {id:that.options.data}, function(data) {
					if(!data)
						return false;
						
					that.options.post.id = that.options.data;
					
					$(that.options.client).val(data.data.id);
					
					if(data.contenu) {
					
						var i = 0;
						
						for(var id in data.contenu) {
							
							that.options.post.contenu[i] = {};
							
							var tr = $('<tr id=" ' + i + '" ></tr>').appendTo(that.table);
					
							var td = $('<td></td>').appendTo(tr);
							that.options.post.contenu[i].quantite = $('<input type="text" value="' + data.contenu[id].quantite + '">').appendTo(td);
							
							var td = $('<td></td>').appendTo(tr);
							that.options.post.contenu[i].description = $('<textarea class="autosize">' + data.contenu[id].description + '</textarea>').appendTo(td);
							$(that.options.post.contenu[i].description).autosize({append: "\n"});
							
							var td = $('<td></td>').appendTo(tr);
							that.options.post.contenu[i].pu = $('<input type="text" value="' + data.contenu[id].pu + '">').appendTo(td);
							
							var td = $('<td></td>').appendTo(tr);
							that.options.post.contenu[i].montant = $('<input type="text" value="' + data.contenu[id].montant + '">').appendTo(td)
							.keyup(function() {
								that._total();
							});
							
							i++;
						}
					}
					
					that.options.post.contenu[i] = {};
					
					var tr = $('<tr id=" ' + i + '" ></tr>').appendTo(that.table);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].quantite = $('<input type="text">').appendTo(td);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].description = $('<textarea class="autosize"></textarea>').appendTo(td);
					$(that.options.post.contenu[i].description).autosize({append: "\n"});
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].pu = $('<input type="text">').appendTo(td);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].montant = $('<input type="text">').appendTo(td)
					.keyup(function() {
						that._total();
					});
					
					that.max = i;
					that._ajouter_ligne();
					that._total();
					
				}, "json");
			}
			else if(that.options.data && that.options.document == 'factures') {
				
				$.post('ajax/devis/devis.selectionner', {id:that.options.data.id}, function(data) {
					if(!data)
						return false;
						
					$(that.options.client).val(data.data.id);
					
					if(data.contenu) {
					
						var i = 0;
						
						for(var id in data.contenu) {
							
							that.options.post.contenu[i] = {};
							
							var tr = $('<tr id=" ' + i + '" ></tr>').appendTo(that.table);
					
							var td = $('<td></td>').appendTo(tr);
							that.options.post.contenu[i].quantite = $('<input type="text" value="' + data.contenu[id].quantite + '">').appendTo(td);
							
							var td = $('<td></td>').appendTo(tr);
							that.options.post.contenu[i].description = $('<textarea class="autosize">' + data.contenu[id].description + '</textarea>').appendTo(td);
							$(that.options.post.contenu[i].description).autosize({append: "\n"});
							
							var td = $('<td></td>').appendTo(tr);
							that.options.post.contenu[i].pu = $('<input type="text" value="' + data.contenu[id].pu + '">').appendTo(td);
							
							var td = $('<td></td>').appendTo(tr);
							that.options.post.contenu[i].montant = $('<input type="text" value="' + data.contenu[id].montant + '">').appendTo(td)
							.keyup(function() {
								that._total();
							});
							
							i++;
						}
					}
					
					that.options.post.contenu[i] = {};
					
					var tr = $('<tr id=" ' + i + '" ></tr>').appendTo(that.table);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].quantite = $('<input type="text">').appendTo(td);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].description = $('<textarea class="autosize"></textarea>').appendTo(td);
					$(that.options.post.contenu[i].description).autosize({append: "\n"});
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].pu = $('<input type="text">').appendTo(td);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].montant = $('<input type="text">').appendTo(td)
					.keyup(function() {
						that._total();
					});
					
					that.max = i;
					that._ajouter_ligne();
					that._total();
					
				}, "json");
			}
			else {
			
				for(var i=0;i<5;i++) {
					
					that.options.post.contenu[i] = {};
					
					var tr = $('<tr id=" ' + i + '" ></tr>').appendTo(that.table);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].quantite = $('<input type="text">').appendTo(td);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].description = $('<textarea class="autosize"></textarea>').appendTo(td);
					$(that.options.post.contenu[i].description).autosize({append: "\n"});
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].pu = $('<input type="text">').appendTo(td);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].montant = $('<input type="text">').appendTo(td)
					.keyup(function() {
						that._total();
					});
					
					that.max = i;
				}
				
				that._ajouter_ligne();
			}
			
			var tfoot = $('<tfoot></tfoot>').appendTo(table);
				
			var tr = $('<tr></tr>').appendTo(tfoot);
			$('<td style="border:0" colspan="3"></td>').appendTo(tr);
			var td = $('<td class="center"></td>').appendTo(tr);
			that.total = $('<strong></strong>').appendTo(td);
			that._total();
			
			var form = $('<div class="form"></div>').appendTo(that.element);
			$('<button type="submit">Envoyer</button>').appendTo(form)
			.click(function() {
			
				that.options.post.client = that.options.client.val();
				
				if(!that.options.post.client)
					return;
					
				var contenu = {};
					
				for(var i in that.options.post.contenu)
					contenu[i] = {
						quantite: that.options.post.contenu[i].quantite.val(),
						description: that.options.post.contenu[i].description.val(),
						pu: that.options.post.contenu[i].pu.val(),
						montant: that.options.post.contenu[i].montant.val()
					}
				
				
				var post = {
					id: that.options.post.id,
					client:that.options.post.client,
					contenu:contenu,
				};
				
				$.post('ajax/' + that.options.document + '/' + that.options.document + '.ajouter', post, function(data) {
					$(that.element).empty().html();
					
					if(that.options.document == 'devis') {
						$('#menu li a').removeClass('select');
						$('.listerDevis').addClass('select');
						$(that.element).listerDevis();
					}
					else if(that.options.document == 'factures') {
						$('#menu li a').removeClass('select');
						$('.listerFactures').addClass('select');
						$(that.element).listerFactures();
					}
				});
			});
		},
		
		_ajouter_ligne: function() {
			var that = this;
			
			$('tbody tr:last td input').focus(function(){
			
				if(that.max == $($(this).parent()).parent().attr('id')) {
				
					that.max++;
					
					var i = that.max;
					
					that.options.post.contenu[i] = {};
							
					var tr = $('<tr id=" ' + i + '" ></tr>').appendTo(that.table);
				
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].quantite = $('<input type="text">').appendTo(td);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].description = $('<textarea class="autosize"></textarea>').appendTo(td);
					$(that.options.post.contenu[i].description).autosize({append: "\n"});
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].pu = $('<input type="text">').appendTo(td);
					
					var td = $('<td></td>').appendTo(tr);
					that.options.post.contenu[i].montant = $('<input type="text">').appendTo(td)
					.keyup(function() {
						that._total();
					});
					
					that._ajouter_ligne();
				}
			});
			
			$('.contenu-devis tr td').click(function() {
				$(this).children().focus();
			});
		},
		
		_rechercher_client: function(data) {
			var that = this;
			var tr = $('<tr></tr>').appendTo(that.rechercher);
			$('<td>' + (data.societe ? data.societe : '') + '</td>').appendTo(tr);
			$('<td>' + (data.nom ? data.nom + ' ' : '') + (data.prenom ? data.prenom : '') + '</td>').appendTo(tr);
			
			var td = $('<td class="ajouter"></td>').css('padding', '0 5px').appendTo(tr);
			$('<button>Ajouter</button>').appendTo(td)
			.click(function() {
				$(that.rechercher).remove();
				$(that.options.client).val(data.id);
			});
		},
		
		_total: function() {
			var that = this;
			var total = 0;
			
			for(var i in that.options.post.contenu)
				if(that.options.post.contenu[i].montant.val())
					total += parseFloat(that.options.post.contenu[i].montant.val());
			
			$(that.total).empty().text(Math.round(total*100)/100 + " €");
		},
		
	});
})(jQuery);