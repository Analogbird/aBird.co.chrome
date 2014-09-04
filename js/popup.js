/**
 * Load the popup and get the information we need to fly from background.js.
 */
window.addEventListener('load', function() {
	chrome.extension.getBackgroundPage().EXT.currentTab(document);
});
