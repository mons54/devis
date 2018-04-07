$(document).ready(function() {
	$._connexion(false);
});

(function($){
	
	$.extend({
		
		options: {
			element: 'body',
			post: {},
		},
		
		_connexion: function(error) {
		
			var that = this;
			
			$(that.options.element).empty().html();
			
			that.header = $('<header></header').appendTo(that.options.element);
			
			$('<img id="logo" src="img/logo.png" />').appendTo(that.header);
			$('<h1>Connexion</h1>').appendTo(that.header);
	
			that.content = $('<section id="content"></section>').css({'margin-top':'30px', 'border-radius':'5px'}).appendTo(that.options.element);
			
			if(error == 'connexion') {
				$('<p>Vous avez essayé de vous connecter trop de fois avec un mot de passe non valide</p>').css({'color':'#930', 'margin':'0 0 20px 10px', 'font-weight':'bold'}).appendTo(that.content);
				return;
			}
			else if(error) {
				$('<p>Mot de passe incorrect</p>').css({'color':'#930', 'margin':'0 0 20px 10px', 'font-weight':'bold'}).appendTo(that.content);
			}
			
			var form = $('<div class="form"></div>').appendTo(that.content);
			$('<label>Mot de passe</label>').appendTo(form);
			that.options.post.password = $('<input type="password"></input>').appendTo(form);
			
			var div = $('<section></section>').css('margin-top', '20px').appendTo(that.content);
			
			var form = $('<div class="form"></div>').appendTo(div);
			$('<button type="submit" class="submit">Connexion</button>').appendTo(form)
			.click(function() {
				if(!$(that.options.post.password).val())
					return;
					
				$.post('ajax/connexion.php', {password:$(that.options.post.password).val()}, function(data) {
					if(data)
						that._connexion(data);
					else
						top.location.href = '';
				});
			});
		},
		
	});
})(jQuery);