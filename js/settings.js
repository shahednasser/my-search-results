const showBadgeElement = $("#show_badge"),
      getNotificationsElement = $("#get_notifications");
chrome.storage.sync.get(['settings'], function(results) {
    let show_badge = true,
        get_notifications = false;
    if(results.settings) {
        show_badge = results.settings.hasOwnProperty('show_badge') ? results.settings.show_badge : true;
        get_notifications = results.settings.hasOwnProperty('get_notifications') ? results.settings.get_notifications : false;
    }
    showBadgeElement.prop('checked', show_badge);
    getNotificationsElement.prop('checked', get_notifications);
});

$("#saveBtn").on('click', function () {
    let settings = {show_badge: showBadgeElement.is(":checked"), get_notifications: getNotificationsElement.is(":checked")};
    const self = this;
    $(self).prop('disabled', true);
    chrome.storage.sync.set({settings}, function () {
        showAlertSuccess($(".form"), 'Settings saved successfully!');
        $(self).prop('disabled', false);

        if(!show_badge) {
            //remove any shown badge from tabs
            chrome.tabs.query({}, function(tabs) {
                for(let i = 0; i < tabs.length; i++) {
                    chrome.browserAction.setBadgeText({text: '', tabId: tabs[i].id});
                    chrome.browserAction.setTitle({tabId: tabs[i].id, title: ''});
                }
            });
        }
    });
});