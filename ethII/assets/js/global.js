jQuery(function($) {
	
	var do_translate = function() {
		$('html').i18n();
	}

	$.i18n().load({
		'en': './i18n/en.json',
		'es': './i18n/es.json'

	}).done(function() {
		
		$('.locale-switcher').on('click', 'a', function(e) {
			//e.preventDefault();
			console.log($(this).data('locale'));
			$.i18n().locale = $(this).data('locale');
			setCookie('langPool', $(this).data('locale'), 10000);
			do_translate();
		});

		if(getCookie('langPool')) {
			$.i18n().locale = getCookie('langPool');
		} else {
			$.i18n().locale = 'en';
		}
		do_translate();
	});
});

const getCurrentYear = ()=>{
    return new Date().getFullYear();
}
document.getElementById('currentyear').textContent = getCurrentYear()