const searchTabs = {};
chrome.webRequest.onCompleted.addListener(function (details) {
    console.log("here1", details.url);
    if(details.url.indexOf('google.com') !== -1) {
        console.log("here2");
        const urlObj = new URL(details.url),
              searchQuery = urlObj.searchParams.get('q');
        if(searchQuery) {
            searchTabs[details.tabId] = searchQuery;
        }
        console.log(searchQuery, searchTabs);
    }
}, {urls: ["*://google.com/search"]}, []);

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs[0], searchTabs);
        callback(searchTabs[tabs[0].id]);
    });
    return true;  // Will respond asynchronously.
});