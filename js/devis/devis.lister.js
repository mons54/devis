
(function ($) {

    $.widget("ui.listerDevis", {
	
		options: {
			table: {
				id: 'Devis',
				date: 'Date',
				client: 'Client',
				imprimer: '',
				facturer: '',
				modifier: '',
				supprimer: '',
			},
		},
		
		_init: function() {
			
			var that = this;

			$('<input style="padding: 8px 15px;border: 1px solid #dadada;margin-bottom: 20px;" placeholder="Recherche">')
			.appendTo(that.element)
			.change(function () {
					that._lister(null, $(this).val());
			});
			
			var table = $('<table id="lister-devis"></table>').appendTo(that.element);
			var tr = $('<tr></tr>').appendTo(table);
			
			for(var name in that.options.table)
				$('<th class="' + name + '">' + that.options.table[name] + '</th>').appendTo(tr);
			
			that.tbody = $('<tbody></tbody>').appendTo(table);
				
			that._lister(0);
		},
		
		_lister: function(page, search) {
			var that = this;
			
			$('html,body').animate({scrollTop: $("body").offset().top}, 'slow');
			
			$(that.tbody).empty().html();
			
			if (search) {
				var post = { search: search };
			} else {
					var post = { page:page };
			}
			
			$.post('ajax/devis/devis.lister', post, function(data) {
				if(data) {
					for(var i in data.data)
						that._afficher_devis(data.data[i]);
				}
				
				$(that.page).remove();
				
				if(!search && data.page) {
					that.options.page = data.page.page;
					that.page = $('<section id="page"></section>').appendTo(that.element);
					
					if (data.page.pagePrec) {
						var div = $('<div class="page_prec"></div>').appendTo(that.page);
						that._page(data.page.pagePrec, div);
					}

					if (data.page.pageSuiv) {
						var div = $('<div class="page_suiv"></div>').appendTo(that.page);
						that._page(data.page.pageSuiv, div);
					}

					var div = $('<div class="_page"></div>').appendTo(that.page);
					for (var i in data.page.listPage)
						that._page(data.page.listPage[i], div);
				}
					
			}, "json");
		},
		
		_page: function(page, div) {

            var that = this;

            if (page.num == that.options.page)
				var button = $('<button class="page"><strong>' + page.nom + '</strong></button>').appendTo(div);
            else
				var button = $('<button class="page">' + page.nom + '</button>').appendTo(div);

            button.click(function () {
				that._lister(page.num);
            });
        },
		
		_afficher_devis: function(data) {
			var that = this;
			
			var tr = $('<tr id="' + data.id + '"></tr>').appendTo(that.tbody);
			
			for(var name in data)
				$('<td class="' + name + '">' + (data[name] ? data[name] :  '') + '</td>').appendTo(tr);
			
			var td = $('<td class="imprimer"></td>').appendTo(tr);
			$('<a target="_blank" href="pdf/devis.php?id='+ data.id +'"><button>Imprimer</button></a>').appendTo(td);
			
			var td = $('<td class="facturer"></td>').appendTo(tr);
			$('<button>Facturer</button>').appendTo(td)
			.click(function() {
				$(that.element).empty().html();
				$('#menu li a').removeClass('select');
				$('.ajouterFactures').addClass('select');
				$(that.element).ajouterFactures({data:data});
			});
			
			var td = $('<td class="modifier"></td>').appendTo(tr);
			$('<button>Modifier</button>').appendTo(td)
			.click(function() {
				$(that.element).empty().html();
				$('#menu li a').removeClass('select');
				$('.ajouterDevis').addClass('select');
				$(that.element).ajouterDevis({data:data.id});
			});
			
			var td = $('<td class="supprimer"></td>').appendTo(tr);
			$('<button>X</button>').appendTo(td)
			.click(function() {
			
				var fenetre = $('<div class="fenetre"></div>').css('height', '100px').appendTo($.header);
				
				$('<button class="close">X</button>').appendTo(fenetre)
				.click(function() {
					$(fenetre).remove();
				});
				
				$('<p>Supprimer Devis n° ' + data.id + ' ?</p>').appendTo(fenetre);
				
				var form = $('<div class="form"></div>').css({'display':'block', 'margin-top':'30px'}).appendTo(fenetre);
				$('<button type="submit">Supprimer</button>').appendTo(form)
				.click(function() {
					$(fenetre).remove();
					$('#' + data.id).remove();
					$.post('ajax/devis/devis.supprimer', {id:data.id});
				});
			});
		},

    });

})(jQuery);