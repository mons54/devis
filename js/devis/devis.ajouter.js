
(function ($) {

    $.widget("ui.ajouterDevis", {
	
		_init: function() {
			
			var that = this;
			
			$.element = that.element;
			$.options.data = that.options.data;
			$.options.document = 'devis';
			$._ajouter_document();
		},
    });

})(jQuery);