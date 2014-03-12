var openUrl = 'bookmarkManager.html';
/*
chrome.tabs.getAllInWindow(null, function (tabs) {
	
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].url.length >= prefixUrl.length && tabs[i].url.substr(0, prefixUrl.length) == prefixUrl) {
            chrome.tabs.update(tabs[i].id, { selected: true });
            window.close();
            return;
        }
    }
   
    chrome.tabs.create({ url: openUrl, selected: true });
    window.close();
});
	 */
chrome.tabs.create({ url: openUrl, selected: true });
window.close();
