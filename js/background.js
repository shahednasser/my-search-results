import(chrome.runtime.getURL('./helpers'));
const searchTabs = {};
chrome.webRequest.onCompleted.addListener(function (details) {
    const urlObj = new URL(details.url)
    window.checkForSearchQuery(details.tabId, details.url)
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
            window.checkForSearchQuery(tabs[i].id, tabs[i].url);
        }
    });
});