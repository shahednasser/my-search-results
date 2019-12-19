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