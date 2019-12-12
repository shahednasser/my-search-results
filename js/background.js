const searchTabs = {};
chrome.webRequest.onCompleted.addListener(function (details) {
    const urlObj = new URL(details.url)
    checkForSearchQuery(details.tabId, details.url)
}, {urls: ["<all_urls>"]}, []);

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        callback(searchTabs[tabs[0].id]);
    });
    return true;  // Will respond asynchronously.
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    if(searchTabs.hasOwnProperty(tabId)) {
        delete searchTabs[tabId];
    }
});

chrome.runtime.onInstalled.addListener(function (details) {
    chrome.tabs.query({}, function(tabs) {
        for(let i = 0; i < tabs.length; i++) {
            checkForSearchQuery(tabs[i].id, tabs[i].url);
        }
    });
});

function checkForSearchQuery(tabId, url) {
    const urlObj = new URL(url)
    if(urlObj.href.indexOf('google.com') !== -1 && urlObj.pathname.indexOf('/search') !== -1) {
        const searchQuery = urlObj.searchParams.get('q');
        if(searchQuery) {
            searchTabs[tabId] = searchQuery;
        }
    }
}