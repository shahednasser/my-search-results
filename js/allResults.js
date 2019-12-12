const urlObj = new URL(location.href),
      searchQuery = urlObj.searchParams.get('searchQuery');
if(!searchQuery) {
    window.location.href = chrome.runtime.getURL('popup.html')
}
const resultsList = $("#results");
$("#searchQuery").text(searchQuery);
chrome.storage.sync.get(['search_results'], function(result) {
    if(!result.search_results || !result.search_results.hasOwnProperty(searchQuery)) {
        window.location.href = chrome.runtime.getURL('popup.html')
    }

    const results = result.search_results[searchQuery];
    for(let i = 0; i < results.length; i++) {
        resultsList.append("<li>" + results[i] + '</li>');
    }
});