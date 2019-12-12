chrome.runtime.sendMessage({}, function (response) {
    console.log("response", response);
    if(response) {
        $("input[name=search_query]").val(response);
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        $("input[name=search_result]").val(tabs[0].url);
    });
});

$("#saveSearchResult").on('click', function () {
    const searchQuery = $("input[name=search_query]").val(),
          searchResult = $("input[name=search_result]").val();
    const self = this;
    self.prop('disabled', true);
    chrome.storage.sync.get(['search_results'], function (result) {
        const search_results = result.search_results;
        if(!search_results.hasOwnProperty(searchQuery)) {
            search_results[searchQuery] = [];
        }
        search_results[searchQuery].push(searchResult);
        chrome.storage.sync.set({search_results}, function () {
            console.log("success");
            self.prop('disabled', false);
        });
    });
});