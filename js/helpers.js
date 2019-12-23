import(chrome.runtime.getURL('js/jquery.min.js'));
const resultsContainer = $("#resultsContainer").length ? $("#resultsContainer") : $("#results"),
      resultsList = resultsContainer.attr('id') === "results" ? resultsContainer : resultsContainer.find('.results');
window.updateList = function (searchQuery, hasLimit, shouldRedirect) {
    resultsList.children().remove();
    chrome.storage.sync.get(['search_results'], function(result) {
        if(result.search_results && result.search_results.hasOwnProperty(searchQuery)) {
            const searchResults = result.search_results[searchQuery],
                  limit = hasLimit ? Math.min(3, searchResults.length) : searchResults.length;
            for(let i = 0; i < limit; i++) {
                resultsList.append('<li><a href="' + searchResults[i].url + '" target="_blank">' +
                    (searchResults[i].title ? searchResults[i].title : searchResults[i].url) + '</a>' + 
                    (searchResults[i].title ? '' : '<br><small class="text-gray">' + searchResults[i].url + 
                    '</small>') + '</li>');
            }
            if(hasLimit && searchResults.length > 3) {
                resultsContainer.append('<a href="' + chrome.runtime.getURL('allResults.html') + '?searchQuery=' + 
                    searchQuery + '">Show more</a>');
            }
            resultsContainer.removeClass('d-none');
        } else {
            if(shouldRedirect) {
                window.location.href = chrome.runtime.getURL('popup.html');
            } else {
                resultsContainer.addClass('d-none');
            }
        }
    });
}

window.showAlertSuccess = function (formContainer, message) {
    formContainer.before('<div class="alert alert-success">' + message + '</div>');
}

window.checkForSearchQuery = function (tabId, url) {
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

window.checkSimilarQueries = function (search_results, searchQuery) {
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