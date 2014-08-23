/**
 * Put all our stuff in a safe place.
 */
var ABB = {

	callback: null,
	parseUri: function ABB$parseUri (str) {
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
	
	verifyUri: function ABB$verifyUri (str) {
		var parsedURL = ABB.parseUri(str);
		if (parsedURL.protocol.indexOf('http') === 0 && parsedURL.host.indexOf('.') !== -1 && /[A-Za-z]/.test(parsedURL.host)) {
			return true;
		}

		return false;
	}

};

/**
 * Once the popup is loaded, this function is called.
 * It injects the JS (content script) to get the information we want from the
 * active tab.
 */
function getCurrentTab(callback) {

	chrome.tabs.getSelected(null, function(tab) {

		if (ABB.verifyUri(tab.url)) {

			ABB.callback = callback;
			chrome.tabs.executeScript(null, {
				file: 'js/content.js'
			});

		} else {
			callback(false);
		}

	});

};

/**
 * Run the callback when the content script makes a request.
 */ 
chrome.extension.onMessage.addListener(function(request)  {
	ABB.callback(request);
});
