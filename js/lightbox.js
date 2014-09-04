
var LGX = {
	
	show: function overlay$show () {

		var style = document.createElement('style'),
			div = document.createElement('div'),
			height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
			overlayWidth = 424,
			left = Math.floor((window.innerWidth - overlayWidth) / 2),
			top = scrollY,
			iframe = document.createElement('iframe');

		style.setAttribute('id', 'birdsOverlay');
		style.appendChild(document.createTextNode('body { height: 100%; overflow: hidden; };'));
		document.head.appendChild(style);

		div.setAttribute('id', 'birdsOverlayDiv');
		div.setAttribute('style', 'position:absolute;top:0px;left:0px;width:100%;height:' + height + 'px;z-index: 16777270;background-color:#000;opacity: 0.35;');

		div.onclick = function() {
			LGX.hide();
		}

		document.body.insertBefore(div, document.body.firstChild);

		LGX.lastKey = window.onkeyup;
		window.onkeyup = function(e) {
			if (e.keyCode == 27) {
				window.onkeyup = null;
				LGX.hide();
			}
		}

		iframe.setAttribute('id', 'birdsOverlayFrame');
		iframe.setAttribute('frameborder', '0');
		iframe.setAttribute('allowTransparency', 'true');
		iframe.setAttribute('scrolling', 'no');
		iframe.setAttribute('src', chrome.extension.getURL('lightbox.html'));
		iframe.setAttribute('style', 'border:none;width:' + overlayWidth + 'px;height:' + window.innerHeight + 'px;position:absolute;top:' + top + 'px;left:' + left + 'px;z-index:16777271;background-color:transparent;');

		document.body.insertBefore(iframe, document.body.firstChild);
	},

	hide: function overlay$hide () {

		var style = document.getElementById('birdsOverlay');
		var div = document.getElementById('birdsOverlayDiv');
		var iframe = document.getElementById('birdsOverlayFrame');
		if (style || div || iframe) {
			style.parentNode.removeChild(style);
			div.parentNode.removeChild(div);
			iframe.parentNode.removeChild(iframe);
		}

		if (LGX.lastKey) {
			window.onkeyup = LGX.lastKey;
		} else {
			window.onkeyup = null;
		}

	}

};


chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

	LGX.show(message);
	sendResponse({overlay: true});

});
