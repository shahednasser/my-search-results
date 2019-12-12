chrome.runtime.sendMessage({}, function (response) {
    if(response) {
        $("input[name=search_query]").val(response);
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        $("input[name=search_result]").val(tabs[0].url);
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