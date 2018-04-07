
(function ($) {

    $.widget("ui.ajouterClient", {
	
		options: {
			post: {},
		},
		
		_create: function () {
			var that = this;
		},
		
		_init: function() {
			
			var that = this;
			
			var div = $('<section class="ajouter-client"></section>').appendTo(that.element);
			
			var form = $('<div class="form"></div>').appendTo(div);
			$('<label>Société</label>').appendTo(form);
			that.options.post.societe = $('<input type="text" value="' + (that.options.data ? that.options.data.societe : '') + '">').appendTo(form);
			
			var form = $('<div class="form"></div>').appendTo(div);
			$('<label>Nom</label>').appendTo(form);
			that.options.post.nom = $('<input type="text" value="' + (that.options.data ? that.options.data.nom : '') + '">').appendTo(form);
			
			var form = $('<div class="form"></div>').appendTo(div);
			$('<label>Prénom</label>').appendTo(form);
			that.options.post.prenom = $('<input type="text" value="' + (that.options.data ? that.options.data.prenom : '') + '">').appendTo(form);
			
			var div = $('<section class="ajouter-client"></section>').appendTo(that.element);
			
			var form = $('<div class="form"></div>').appendTo(div);
			$('<label>Adresse</label>').appendTo(form);
			that.options.post.adresse = $('<textarea class="adresse">' + (that.options.data ? that.options.data.adresse : '') + '</textarea>').appendTo(form);
			
			var form = $('<div class="form"></div>').appendTo(div);
			$('<label>Code Postal</label>').appendTo(form);
			that.options.post.cp = $('<input type="text" value="' + (that.options.data ? that.options.data.cp : '') + '">').appendTo(form);
			
			var form = $('<div class="form"></div>').appendTo(div);
			$('<label>Ville</label>').appendTo(form);
			that.options.post.ville = $('<input type="text" value="' + (that.options.data ? that.options.data.ville : '') + '">').appendTo(form);
			
			var div = $('<section class="ajouter-client"></section>').appendTo(that.element);
			
			that.options.post.id = that.options.data ? that.options.data.id : 0;
			
			var form = $('<div class="form"></div>').appendTo(div);
			$('<button type="submit" class="submit">Envoyer</button>').appendTo(form)
			.click(function() {
				var post = {
					id: that.options.post.id,
					societe:$(that.options.post.societe).val(),
					nom: $(that.options.post.nom).val(),
					prenom: $(that.options.post.prenom).val(),
					adresse: $(that.options.post.adresse).val(),
					cp: $(that.options.post.cp).val(),
					ville: $(that.options.post.ville).val(),
				};
				
				$.post('ajax/client/client.ajouter', post, function(data) {
					if(data) {
						$('#menu li a').removeClass('select');
						$('.listerClient').addClass('select');
						$(that.element).empty().html();
						$(that.element).listerClient();
					}
				});
			});
		},

    });

})(jQuery);