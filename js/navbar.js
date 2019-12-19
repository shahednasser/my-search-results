$("#saveSearchLink").click(function () {
    openLink('popup.html')
});

$("#viewAllLink").click(function () {
    openLink('viewAll.html');
});

$("#viewSettings").click(function () {
    openLink('settings.html');
});

function openLink(file) {
    if(!$(this).parent().hasClass('active')) {
        window.location.href = chrome.runtime.getURL(file);
    } else {
        $(".navbar-toggler").trigger('click');
    }
}