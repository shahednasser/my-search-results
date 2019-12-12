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
    console.log(sender, request);
    return callback(searchTabs[sender.tab.id]);
});