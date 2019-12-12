const searchTabs = {};
chrome.webRequest.onCompleted.addListener(function (details) {
    if(details.url.indexOf('google.com') !== -1) {
        const urlObj = new URL(details.url),
              searchQuery = urlObj.searchParams.get('q');
        if(searchQuery) {
            searchTabs[details.tabId] = searchQuery;
        }
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    return callback(searchTabs[sender.tab.id]);
});