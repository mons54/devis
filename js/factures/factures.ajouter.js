
(function ($) {

    $.widget("ui.ajouterFactures", {
	
		_init: function() {
			
			var that = this;
			
			$.element = that.element;
			$.options.data = that.options.data;
			$.options.document = 'factures';
			$._ajouter_document();
		},
    });

})(jQuery);