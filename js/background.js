const searchTabs = {};
chrome.webRequest.onCompleted.addListener(function (details) {
    if(details.url.indexOf('google.com') !== -1) {
        const urlObj = new URL(details.url),
              searchQuery = urlObj.searchParams.get('q');
        if(searchQuery) {
            searchTabs[details.tabId] = searchQuery;
        }
    }
}, {urls: ["*://*.google.com/"]}, []);

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        return callback(searchTabs[tabs[0].id]);
    });
    return true;  // Will respond asynchronously.
});