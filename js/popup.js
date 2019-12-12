chrome.storage.sync.clear();
chrome.runtime.sendMessage({}, function (searchQuery) {
    if(searchQuery) {
        $("input[name=search_query]").val(searchQuery);
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        $("input[name=search_result_url]").val(tabs[0].url);
        $("input[name=search_result_title]").val(tabs[0].title);
    });

    updateList(searchQuery);
});

const formContainer = $("#form");

$("#saveSearchResult").on('click', function () {
    const searchQuery = $("input[name=search_query]").val(),
          searchResult = $("input[name=search_result_url]").val(),
          searchResultTitle = $("input[name=search_result_title]").val(),
          self = $(this);
    self.prop('disabled', true);
    if(formContainer.prev('alert').length) {
        formContainer.prev('alert').remove();
    }
    chrome.storage.sync.get(['search_results'], function (result) {
        let search_results = result.search_results;
        if(!search_results) {
            search_results = {};
        }
        if(!search_results.hasOwnProperty(searchQuery)) {
            search_results[searchQuery] = [];
        }
        search_results[searchQuery].push({title: searchResultTitle, url: searchResult});
        chrome.storage.sync.set({search_results}, function () {
            formContainer.before('<div class="alert alert-success">Search Result has been saved!</div>');
            self.prop('disabled', false);
            updateList(searchQuery);
        });
    });
});

const resultsContainer = $("#resultsContainer"),
      resultsList = resultsContainer.find('.results');
function updateList(searchQuery) {
    resultsList.children().remove();
    chrome.storage.sync.get(['search_results'], function(result) {
        if(result.search_results && result.search_results.hasOwnProperty(searchQuery)) {
            const searchResults = result.search_results[searchQuery],
                  limit = Math.min(3, searchResults.length);
            for(let i = 0; i < limit; i++) {
                resultsList.append('<li><a href="' + searchResults[i].url + '" target="_blank">' +
                    (searchResults[i].title ? searchResults[i].title : searchResults[i].url) + '</a>' + 
                    (searchResults[i].title ? '' : '<br><small class="text-gray">' + searchResults[i].url + 
                    '</small>') + '</li>');
            }
            if(searchResults.length > 3) {
                resultsContainer.append('<a href="' + chrome.runtime.getURL('allResults.html') + '?searchQuery=' + 
                    searchQuery + '">Show more</a>');
            }
        } else {
            resultsContainer.remove();
        }
    });
}