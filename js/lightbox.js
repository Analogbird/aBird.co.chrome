/**
 * Load the lighbox and get the information we need to fly from background.js.
 */
window.addEventListener('load', function() {

	chrome.extension.sendMessage({
		from: 'context'
	}, function(response) {
		
		var content = document.getElementById('content'),
			url = document.createElement('p'),
			reduced = document.createElement('p'),
			clipboard = document.createElement('p'),
			range = document.createRange(),
			selection = window.getSelection();

		url.innerHTML = response.url;
		url.setAttribute('id', "url");
		url.setAttribute('href', response.url);
		url.setAttribute('target', '_blank');
		reduced.innerHTML = 'Reduced by: ' + response.shrank.percent + '%';
		clipboard.innerHTML = "(Copied, just paste)";

		while (content.hasChildNodes()) {
			content.removeChild(content.lastChild);
		}

		url.onclick = function () {
			var win = window.open(response.url, '_blank');
			win.focus();
		};

		content.appendChild(url);
		content.appendChild(reduced);
		content.appendChild(clipboard);

		range.selectNodeContents(url);
		selection.removeAllRanges();
		selection.addRange(range);

		document.execCommand("Copy", false, null);
		window.getSelection().removeAllRanges();

	});

});
