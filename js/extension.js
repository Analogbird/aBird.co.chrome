/**
 * Put all our stuff in a safe place.
 * 
 * parseUri 1.2.2
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 */
var EXT = {

	document: null,
	api: 'http://ab.je/content',
	key: '680e4bec6651c1b7682202b43761f392d633dd99',
	parseUri: function AB$parseUri (str) {
		var	o = {
				strictMode: false,
				key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
				q: {
					name: 'queryKey',
					parser: /(?:^|&)([^&=]*)=?([^&]*)/g
				},
				parser: {
					strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
					loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
				}
			},
			m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
			uri = {},
			i = 14;

		while (i--) uri[o.key[i]] = m[i] || '';

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});

		return uri;
	},

	verifyUri: function AB$verifyUri (str) {
		var parsedURL = EXT.parseUri(str);
		if (parsedURL.protocol.indexOf('http') === 0 && parsedURL.host.indexOf('.') !== -1 && /[A-Za-z]/.test(parsedURL.host)) {
			return true;
		}

		return false;
	},

	/**
	 * Background injection callback.
	 *
	 * Make the POST request to the aBird.co API
	 * and populate the popup with the results.
	 * Voila, all set!
	 */
	shrink: function AB$shrink (section, content, callback) {

		var xhr = new XMLHttpRequest();
		xhr.open('POST', EXT.api, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				if (callback) {
					callback(JSON.parse(xhr.responseText));
				} else {
					EXT.populate(JSON.parse(xhr.responseText));
				}
			} else if (xhr.readyState === 4 && xhr.status !== 200) {
				if (callback) {
					callback({ error: true });
				} else {
					EXT.error('http');
				}
			}
		};

		content.key = EXT.key;
		xhr.send(JSON.stringify(content));
	},

	/**
	 * This just helps the content to be placed and copied to the clipboard
	 */
	populate: function AB$populate (data, content) {

		var content = EXT.document.getElementById('content'),
			url = document.createElement('p'),
			reduced = document.createElement('p'),
			clipboard = document.createElement('p');

		url.setAttribute('id', 'url');
		url.innerHTML = data.url;
		reduced.innerHTML = 'Reduced by: ' + data.shrank.percent + '%';
		clipboard.innerHTML = "(Copied, just paste)";

		while (content.hasChildNodes()) {
			content.removeChild(content.lastChild);
		}

		content.appendChild(url);
		content.appendChild(reduced);
		content.appendChild(clipboard);

		url.contentEditable = true;
		url.unselectable = "off";
		url.focus();

	},

	/**
	 * To keep things clean; separate the error into another function.
	 * Not much logic here.
	 */
	error: function AB$error (error) {

		var content = EXT.document.getElementById('content'),
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

		EXT.document.getElementById('body').style.width = '228px';
		content.appendChild(err);
		content.appendChild(message);
	},

	/**
	 * Once the popup is loaded, this function is called.
	 * It injects the JS (content script) to get the information we want from the
	 * active tab.
	 */
	currentTab: function AB$currentTab (document) {

		/**
		 * This fixes an error where the text appears selected
		 * and it's not nice UI.
		 */
		document.addEventListener('focus', function(e) {
	
			EXT.document.execCommand('SelectAll');
			EXT.document.execCommand("Copy", false, null);
			document.getElementById(e.srcElement.id).blur();
	
		}, true);

		chrome.tabs.getSelected(null, function(tab) {

			EXT.document = document;
			if (EXT.verifyUri(tab.url)) {

				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

					/**
					 * Send back the information we need to the extension (to itself),
					 * in this case the URL only.
					 */
					chrome.runtime.sendMessage({
						from: 'tooltip',
						url: tabs[0].url
					});
				});

			} else {
				EXT.error('http');
			}

		});

	}

};


/**
 * Run the callback when the content script makes a request.
 * Get the current tab and fly like a bird.
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

	if (!message) {
		EXT.error('http');
	} else {

		if (message.from === 'tooltip') {
			EXT.shrink('tooltip', {
				data: {
					type: 'url',
					value: message.url
				}
			});	
		} else if (message.from === 'context') {
			chrome.storage.local.get('aBirdData', function(stored) {

				EXT.shrink('context', stored.aBirdData, function(shortened) {
					sendResponse(shortened);
					chrome.storage.local.remove('aBirdData');
				});
			});
		}
	}

	return true;
});

/**
 * Once the extension is installed,
 * setup the context menu.
 */
chrome.runtime.onInstalled.addListener(function() {

	var menu = chrome.contextMenus.create({
		id: 'aBird.co',
		title: 'Fly light!',
		contexts: [
			'page',
			'selection',
			'image',
			'link'
		]
	});

});


/**
 * Since we already have the context menu, now we need to listen
 * for any event that calls it, in this case the click.
 */
chrome.contextMenus.onClicked.addListener(function contextClicked(info, tab) {

	if (tab && info.menuItemId === "aBird.co") {

		var content = {
			meta: {
				url: tab.url || info.pageUrl || '',
				title: tab.title || '',
				favicon: tab.favIconUrl || ''
			},
			data: {
				type: 'url',
				value: tab.url || info.pageUrl || ''
			}
		};

		if (info.mediaType === "image") {
			content.data.type = 'img';
			content.data.value = info.srcUrl;
		} else if (info.linkUrl) {
			content.data.type = 'url';
			content.data.value = info.linkUrl;
		} else if (info.selectionText) {
			content.data.type = 'txt';
			content.data.value = info.selectionText;
		}

		chrome.storage.local.set({ aBirdData: content });
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			tabs.forEach(function(tab) {
				chrome.tabs.sendMessage(tab.id, content);
			})
		});

	}

});
