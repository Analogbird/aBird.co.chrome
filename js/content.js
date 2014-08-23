
/**
 * Send back the information we need to the extension,
 * in this case the URL only.
 */
chrome.extension.sendMessage({
	'url': window.location.href
});
