/**
 * Put all our callback in a safe place.
 */
var abCallback;

/**
 * Once the popup is loaded, this function is called.
 * It injects the JS (content script) to get the information we want from the
 * active tab.
 */
function getCurrentTab(callback) {

	abCallback = callback;
	chrome.tabs.executeScript(null, {
		file: 'js/content.js'
	});

};

/**
 * Run the callback when the content script makes a request.
 */
chrome.extension.onMessage.addListener(function(request)  {
	abCallback(request);
});
