chrome.runtime.sendMessage({}, function (searchQuery) {
    if(searchQuery) {
        $("input[name=search_query]").val(searchQuery);
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        $("input[name=search_result]").val(tabs[0].url);
    });

    chrome.storage.sync.get(['search_results'], function(result) {
        const resultsContainer = $("#resultsContainer");
        if(result.search_results && result.search_results.hasOwnProperty(searchQuery)) {
            const resultsList = resultsContainer.find('.results'),
                  searchResults = result.search_results[searchQuery],
                  limit = Math.min(3, searchResults.length);
            for(let i = 0; i < limit; i++) {
                resultsList.append('<li>' + searchResults[i] + '</li>');
            }
        } else {
            resultsContainer.remove();
        }
    });
});

const formContainer = $("#form");

$("#saveSearchResult").on('click', function () {
    const searchQuery = $("input[name=search_query]").val(),
          searchResult = $("input[name=search_result]").val(),
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
        search_results[searchQuery].push(searchResult);
        chrome.storage.sync.set({search_results}, function () {
            formContainer.before('<div class="alert alert-success">Search Result has been saved!</div>');
            self.prop('disabled', false);
        });
    });
});