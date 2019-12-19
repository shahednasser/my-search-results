//chrome.storage.sync.clear();
chrome.runtime.sendMessage({}, function (searchQuery) {
    if(searchQuery) {
        $("input[name=search_query]").val(searchQuery);
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        $("input[name=search_result_url]").val(tabs[0].url);
        $("input[name=search_result_title]").val(tabs[0].title);
    });

    window.updateList(searchQuery, true, false);
});

const formContainer = $("#form");

$("#saveSearchResult").on('click', function () {
    const searchQuery = $("input[name=search_query]").val() ? $("input[name=search_query]").val().trim() : '',
          searchResult = $("input[name=search_result_url]").val() ? $("input[name=search_result_url]").val().trim() : '',
          searchResultTitle = $("input[name=search_result_title]").val() ? $("input[name=search_result_title]").val().trim() : '',
          self = $(this);
    if(formContainer.prev('alert').length) {
        formContainer.prev('alert').remove();
    }
    if(!searchQuery.length) {
        formContainer.before('<div class="alert alert-danger">Search Query is required.</div>');
        return;
    }
    if(!searchResult.length) {
        formContainer.before('<div class="alert alert-danger">Search Result URL is required.</div>');
        return;
    }
    self.prop('disabled', true);
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
            showAlertSuccess(formContainer, 'Search Result has been saved!');
            self.prop('disabled', false);
            window.updateList(searchQuery, true, false);
        });
    });
});