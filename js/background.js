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
        chrome.pageAction.show(tabId);
        if(se/rchQuery) {
            //check if search query is similar to saved search queries
            chrome.storage.sync.get(['search_results'], function(result) {
                if(result.search_results) {
                    const similarQuery = checkSimilarQueries(result.search_results, searchQuery);
                    if(similarQuery) {
                        //chrome.browserAction.setBadgeText({text: result.search_results[searchQuery].length, tabId});
                        chrome.pageAction.setTitle({tabId, title: 'You have similar saved search results!'});
                    } else {
                        //chrome.browserAction.setBadgeText({text: '', tabId});
                        chrome.pageAction.setTitle({tabId, title: ''});
                    }
                } else {
                    //chrome.browserAction.setBadgeText({text: '', tabId});
                    chrome.pageAction.setTitle({tabId, title: ''});
                }
            });
            searchTabs[tabId] = searchQuery;
        }
    } else {
        if(chrome.pageAction) {
            chrome.pageAction.hide(tabId);
        }
    }
}

function checkSimilarQueries(search_results, searchQuery) {
    if(search_results.hasOwnProperty(searchQuery)) {
        return searchQuery;
    }

    let arr = searchQuery.split(" ");
    const keys = Object.keys(search_results);
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < keys.length; j++) {
            if(keys[j].indexOf(arr[i]) !== -1) {
                return keys[j];
            }
        }
    }

    return null;
}