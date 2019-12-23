export function checkForSearchQuery (tabId, url) {
    const urlObj = new URL(url)
    if(urlObj.href.indexOf('google.com') !== -1 && urlObj.pathname.indexOf('/search') !== -1) {
        const searchQuery = urlObj.searchParams.get('q');
        if(searchQuery) {
            //check if search query is similar to saved search queries
            chrome.storage.sync.get(['search_results', 'settings'], function(result) {
                if(result.search_results) {
                    const similarQuery = checkSimilarQueries(result.search_results, searchQuery);
                    if(similarQuery) {
                        if(!result.settings || result.settings.show_badge) {
                            chrome.browserAction.setBadgeText({text: result.search_results[similarQuery].length.toString(), tabId});
                        }
                        chrome.browserAction.setTitle({tabId, title: 'You have similar saved search results!'});
                    } else {
                        chrome.browserAction.setBadgeText({text: '', tabId});
                        chrome.browserAction.setTitle({tabId, title: ''});
                    }
                } else {
                    chrome.browserAction.setBadgeText({tabId, text: ''});
                    chrome.browserAction.setTitle({tabId, title: ''});
                }
            });
            searchTabs[tabId] = searchQuery;
        }
    }
}

export function checkSimilarQueries (search_results, searchQuery) {
    if(search_results.hasOwnProperty(searchQuery)) {
        return searchQuery;
    }

    let arr = searchQuery.split(" ");
    const keys = Object.keys(search_results);
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < keys.length; j++) {
            console.log(arr[i], keys[j]);
            if(keys[j].indexOf(arr[i]) !== -1) {
                return keys[j];
            }
        }
    }

    return null;
}