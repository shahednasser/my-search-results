const showBadgeElement = $("#show_badge");
chrome.storage.sync.get(['settings'], function(results) {
    let show_badge = true;
    if(results.settings) {
        show_badge = results.settings.hasOwnProperty('show_badge') ? results.settings.show_badge : true;
    }
    showBadgeElement.prop('checked', show_badge);
    getNotificationsElement.prop('checked', get_notifications);
});

$("#saveBtn").on('click', function () {
    let settings = {show_badge: showBadgeElement.is(":checked")};
    const self = this;
    $(self).prop('disabled', true);
    chrome.storage.sync.set({settings}, function () {
        showAlertSuccess($(".form"), 'Settings saved successfully!');
        $(self).prop('disabled', false);

        chrome.runtime.sendMessage({subject: 'refresh'})
    });
});