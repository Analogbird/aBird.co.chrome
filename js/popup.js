/**
 * Load the popup, inject the content script and get the information we need to fly.
 */
window.addEventListener('load', function() {
	chrome.extension.getBackgroundPage().EXT.currentTab(document);
});
