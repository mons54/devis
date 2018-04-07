
(function ($) {

    $.widget("ui.modifierSociete", {
	
		options: {
			post: {},
		},
		
		_create: function () {
			var that = this;
		},
		
		_init: function(bol) {
			
			var that = this;
			
			$(that.element).empty().html();
			
			if(bol)
				$('<p>Informations enregistrées</p>').css({'color':'#930', 'margin':'10px', 'font-weight':'bold'}).appendTo(that.element);
			
			$.get('ajax/societe/societe.selectionner', function(data) {
				
				if(!data)
					return false;
				
				var div = $('<section class="ajouter-client"></section>').appendTo(that.element);
			
				var form = $('<div class="form"></div>').appendTo(div);
				$('<label>Société</label>').appendTo(form);
				that.options.post.nom = $('<input type="text" value="' + data.nom + '">').appendTo(form);
				
				var form = $('<div class="form"></div>').appendTo(div);
				$('<label>Siret</label>').appendTo(form);
				that.options.post.siret = $('<input type="text" value="' + data.siret + '">').appendTo(form);
				
				var div = $('<section class="ajouter-client"></section>').appendTo(that.element);
				
				var form = $('<div class="form"></div>').appendTo(div);
				$('<label>Tel</label>').appendTo(form);
				that.options.post.tel = $('<input type="text" value="' + data.tel + '">').appendTo(form);
				
				var form = $('<div class="form"></div>').appendTo(div);
				$('<label>Email</label>').appendTo(form);
				that.options.post.email = $('<input type="text" value="' + data.email + '">').appendTo(form);
				
				var form = $('<div class="form"></div>').appendTo(div);
				$('<label>Site</label>').appendTo(form);
				that.options.post.url = $('<input type="text" value="' + data.url + '">').appendTo(form);
				
				var div = $('<section class="ajouter-client"></section>').appendTo(that.element);
				
				var form = $('<div class="form"></div>').appendTo(div);
				$('<label>Adresse</label>').appendTo(form);
				that.options.post.adresse = $('<textarea class="adresse">' + data.adresse + '</textarea>').appendTo(form);
				
				var form = $('<div class="form"></div>').appendTo(div);
				$('<label>Code Postal</label>').appendTo(form);
				that.options.post.cp = $('<input type="text" value="' + data.cp + '">').appendTo(form);
				
				var form = $('<div class="form"></div>').appendTo(div);
				$('<label>Ville</label>').appendTo(form);
				that.options.post.ville = $('<input type="text" value="' + data.ville + '">').appendTo(form);
				
				var div = $('<section class="ajouter-client"></section>').appendTo(that.element);
				
				var form = $('<div class="form"></div>').appendTo(div);
				$('<button type="submit" class="submit">Modifier</button>').appendTo(form)
				.click(function() {
					var post = {
						nom:$(that.options.post.nom).val(),
						tel: $(that.options.post.tel).val(),
						email: $(that.options.post.email).val(),
						url: $(that.options.post.url).val(),
						siret: $(that.options.post.siret).val(),
						adresse: $(that.options.post.adresse).val(),
						cp: $(that.options.post.cp).val(),
						ville: $(that.options.post.ville).val(),
					};
					
					$.post('ajax/societe/societe.modifier', post, function(data) {
						if(data)
							that._init(true);
					});
				});
			}, "json");
		},

    });

})(jQuery);