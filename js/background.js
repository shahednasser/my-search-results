const searchTabs = {};
chrome.webRequest.onCompleted.addListener(function (details) {
    const urlObj = new URL(details.url)
    if(urlObj.href.indexOf('google.com') !== -1 && urlObj.pathname.indexOf('/search') !== -1) {
        const searchQuery = urlObj.searchParams.get('q');
        if(searchQuery) {
            searchTabs[details.tabId] = searchQuery;
        }
    }
}, {urls: ["<all_urls>"]}, []);

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        callback(searchTabs[tabs[0].id]);
    });
    return true;  // Will respond asynchronously.
});