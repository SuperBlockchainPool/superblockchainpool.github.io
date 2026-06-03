document.addEventListener('DOMContentLoaded', function() {
	var input = document.getElementById('pool-search-input');
	if (!input) return;
		input.addEventListener('input', function() {
		var query = this.value.trim().toLowerCase();
		document.querySelectorAll('.search-pool-id').forEach(function(row) {
			var text = row.textContent.toLowerCase();
			row.classList.toggle('hide-row', query && text.indexOf(query) === -1);
		});
	});
});