chrome.runtime.sendMessage({}, function (response) {
    if(response) {
        $("input[name=search_result]").val(response);
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        $("input[name=search_result]").val(tabs[0].url);
    });
});
