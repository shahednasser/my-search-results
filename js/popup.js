chrome.runtime.sendMessage({}, function (response) {
    console.log("response", response);
    if(response) {
        $("input[name=search_query]").val(response);
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        $("input[name=search_result]").val(tabs[0].url);
    });
});
