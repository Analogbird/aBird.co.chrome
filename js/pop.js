var AB = {

	/**
	 * Background injection callback.
	 *
	 * Make the POST request to the aBird.co API
	 * and populate the popup with the results.
	 * Voila, all set!
	 */
	shrink: function (tab) {
		
		if (!tab) {
			AB.error('invalid');
			return;
		}

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://api.abird.co/url', true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				AB.populate(JSON.parse(xhr.responseText));
			} else {
				AB.error('http');
			}
		};

		xhr.send(JSON.stringify({
			"key": "f0c73000da767d3a66219acc67403e9007581760",
			"url": tab.url
		}));
	},

	/**
	 * This just helps the content to be placed and copied to the clipboard
	 */
	populate: function(data) {

		var content = document.getElementById('content'),
			url = document.createElement('p'),
			reduced = document.createElement('p'),
			clipboard = document.createElement('p');

		url.setAttribute('id', 'url');
		url.innerHTML = data.url;
		reduced.innerHTML = 'Size reduction: ' + data.shrank.percent + '%';
		clipboard.innerHTML = "(Copied, just paste)";
		
		while (content.hasChildNodes()) {
			content.removeChild(content.lastChild);
		}
		
		document.getElementById('body').style.width = '140px';
		content.appendChild(url);
		content.appendChild(reduced);
		content.appendChild(clipboard);

		url.contentEditable = true;
		url.unselectable = "off";
		url.focus();
		document.execCommand('SelectAll');
        document.execCommand("Copy", false, null);
        url.blur();

	},

	/**
	 * To keep things clean; separate the error into another function.
	 * Not much logic here.
	 */
	error: function(error) {

		var content = document.getElementById('content'),
			err = document.createElement('p'),
			message = document.createElement('p'),
			sectionError = 'I only support HTTP and HTTPS pages.';

		sectionError = (error === 'http') ? 'There seems to be a connection problem.' : sectionError;

		err.setAttribute('id', 'error');
		err.innerHTML = 'I could not fly.';
		message.innerHTML = "My wings have been cut, please try again later.<br />" + sectionError;

		while (content.hasChildNodes()) {
			content.removeChild(content.lastChild);
		}

		document.getElementById('body').style.width = '228px';
		content.appendChild(err);
		content.appendChild(message);
	}

};

/**
 * Load the popup, inject the content script and get the information we need to fly.
 */
window.addEventListener('load', function(evt) {	
	chrome.extension.getBackgroundPage().getCurrentTab(AB.shrink);
});
