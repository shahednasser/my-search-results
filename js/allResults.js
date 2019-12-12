const urlObj = new URL(location.href),
      searchQuery = urlObj.searchParams.get('searchQuery');
if(!searchQuery) {
    window.location.href = chrome.runtime.getURL('popup.html')
}
const resultsList = $("#results");
$("#searchQuery").text(searchQuery);
chrome.storage.sync.get(['search_results'], function(result) {
    if(!result.search_results || !result.search_results.hasOwnProperty(searchQuery)) {
        window.location.href = chrome.runtime.getURL('popup.html');
    }

    const results = result.search_results[searchQuery];
    for(let i = 0; i < results.length; i++) {
        resultsList.append('<li><a href="' + results[i].url + '" target="_blank">' +
                    (results[i].title ? results[i].title : results[i].url) + '</a>' + 
                    (results[i].title ? '' : '<br><small class="text-gray">' + results[i].url + '</small>') + '</li>');
    }
});
$("#saveSearchResult").on('click', function () {
    window.location.href = chrome.runtime.getURL('popup.html');
});