$(document).bind('DOMNodeInserted', function(e) {
	var $el = $(e.target);
	var $button = $el.find('[name=btnAddFBA]');
	if ($button.length > 0) {
		var $container = $button.parent().parent().parent();
		var url = $container.find('a[name=lnkTitle]').attr('href') || '';
		var matches = url.match(/.*\/(.*)$/);
		if (matches.length > 0) {
			var uuid = matches[1];
			$button.on('click', function(event) {
				window.open('https://amazon.com/gp/offer-listing/' + uuid);
			});
		}		
	}	
});
