jQuery(function($) {
	
	var do_translate = function() {
		$('html').i18n();
	}

	$.i18n().load({
		'de': '../../../i18n/de.json',
		'en': '../../../i18n/en.json',
		'es': '../../../i18n/es.json', 
		'fr': '../../../i18n/fr.json',
		'ru': '../../../i18n/ru.json'
	}).done(function() {

		$('.locale-switcher').on('click', 'a', function(e) {
			$.i18n().locale = $(this).data('locale');
			setCookie('lang', $(this).data('locale'), 10000);
			do_translate();
		});

		if(getCookie('lang')) {
			$.i18n().locale = getCookie('lang');
		} else {
			$.i18n().locale = 'en';
		}
		do_translate();
	});
});

document.querySelectorAll(".search-pool-id").forEach(row => {
  row.addEventListener("click", e => {
    if (!e.target.closest("a")) {
      window.location = row.dataset.href;
    }
  });
});