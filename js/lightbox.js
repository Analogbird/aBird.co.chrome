
var shareButton = function shareButton (service, url, popupWidth, popupheight) {

	var shareButton = document.createElement('a');

	shareButton.setAttribute('href', url);
	shareButton.onclick = function() {
		var width = popupWidth,
			height = popupheight,
			left = (window.screen.availWidth  - width)  / 2,
			top = (window.screen.availHeight - height) / 2,
			opts = 'status=1,width=' + width  + ',height=' + height + ',top=' + top + ',left=' + left;

		window.open(this.href, service, opts);
		return false;
	};
	shareButton.innerHTML = '<i class="fa fa-' + service + '-square fa-lg"></i>';

	return shareButton;
};


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

		clipboard.setAttribute('id', 'copy');

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

		content.appendChild(this.shareButton('facebook', 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(response.url), 550, 400));
		content.appendChild(this.shareButton('twitter', 'https://twitter.com/share?url=' + encodeURIComponent(response.url) + '&count=none&text=' + encodeURIComponent('I just used the #fast & #awesome @aBirdCo Chrome #extension to shrink and reduce some content.') + '&related=AnalogBird_', 550, 256));
		content.appendChild(this.shareButton('google-plus', 'https://plus.google.com/share?url=' + encodeURIComponent(response.url) + '&hl=en-US', 550, 500));
		content.appendChild(this.shareButton('linkedin', 'http://www.linkedin.com/shareArticle?url=' + encodeURIComponent(response.url) + '&mini=true&title=' + encodeURIComponent('Content shortened using aBird.co') + '&summary=' + encodeURIComponent('I just used the fast & awesome http://aBird.co Chrome extension to shrink and reduce some content.'), 550, 480));

		range.selectNodeContents(url);
		selection.removeAllRanges();
		selection.addRange(range);

		document.execCommand("Copy", false, null);
		window.getSelection().removeAllRanges();

	});

});
