/**
 * Load the popup, inject the content script and get the information we need to fly.
 */
window.addEventListener('load', function() {

	chrome.runtime.getBackgroundPage(function(page) {
		page.EXT.currentTab(document)
	});

});
