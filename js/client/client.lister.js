
(function ($) {

    $.widget("ui.listerClient", {
	
		options: {
			table: {
				id: 'Id',
				societe: 'Société',
				nom: 'Nom',
				prenom: 'Prénom',
				adresse: 'Adresse',
				cp: 'Code postal',
				ville: 'Ville',
				modifier: '',
				supprimer: '',
			},
		},
		
		_create: function () {
			var that = this;
		},
		
		_init: function() {
			
			var that = this;
			
			var table = $('<table id="lister-client"></table>').appendTo(that.element);
			var tr = $('<tr></tr>').appendTo(table);
			
			for(var name in that.options.table)
				$('<th class="' + name + '">' + that.options.table[name] + '</th>').appendTo(tr);
			
			that.tbody = $('<tbody></tbody>').appendTo(table);
				
			that._lister(0);
		},
		
		_lister: function(page) {
			var that = this;
			
			$('html,body').animate({scrollTop: $("body").offset().top}, 'slow');
			
			$(that.tbody).empty().html();
			
			$.post('ajax/client/client.lister', function(data) {
				if (!data) {
					return;
				}
				$.each(data, function (key, value) {
					that._afficher_client(value);
				});
					
			}, "json");
		},
		
		_afficher_client: function(data) {
			var that = this;
			
			var tr = $('<tr id="' + data.id + '"></tr>').appendTo(that.tbody);
			
			for(var name in data)
				$('<td class="' + name + '">' + (data[name] ? data[name] :  '') + '</td>').appendTo(tr);
			
			var td = $('<td class="modifier"></td>').appendTo(tr);
			$('<button>Modifier</button>').appendTo(td)
			.click(function() {
				$(that.element).empty().html();
				$('#menu li a').removeClass('select');
				$('.ajouterClient').addClass('select');
				$(that.element).ajouterClient({data:data});
			});
			
			var td = $('<td class="supprimer"></td>').appendTo(tr);
			$('<button>X</button>').appendTo(td)
			.click(function() {
			
				var fenetre = $('<div class="fenetre"></div>').css('height', '100px').appendTo($.header);
				
				$('<button class="close">X</button>').appendTo(fenetre)
				.click(function() {
					$(fenetre).remove();
				});
				
				$('<p>Supprimer Client n° ' + data.id + ' ?</p>').appendTo(fenetre);
				
				var form = $('<div class="form"></div>').css({'display':'block', 'margin-top':'30px'}).appendTo(fenetre);
				$('<button type="submit">Supprimer</button>').appendTo(form)
				.click(function() {
					$(fenetre).remove();
					$('#' + data.id).remove();
					$.post('ajax/client/client.supprimer', {id:data.id});
				});
			});
		},

    });

})(jQuery);