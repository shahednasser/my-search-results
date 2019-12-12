chrome.storage.sync.get(['search_results'], function(result) {
    const results = $("#results");
    if(!result.search_results || !Object.keys(result.search_results).length) {
        $("#noSearchResults").removeClass('d-none');
        results.addClass('d-none');
        return;
    }
    for(let query in result.search_results) {
        if(result.search_results.hasOwnProperty(query)) {
            results.append('<li><a href="' + chrome.runtime.getURL('allResults.html') + '?searchQuery=' + query + 
                '>' + query + '</a></li>');
        }
    }
});