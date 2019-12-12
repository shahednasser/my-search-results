const urlObj = new URL(location.href),
      searchQuery = urlObj.searchParams.get('searchQuery');
if(!searchQuery) {
    window.location.href = chrome.runtime.getURL('popup.html')
}
const resultsList = $("#results");
$("#searchQuery").text(searchQuery);
window.updateList(searchQuery, false, true);
$("#saveSearchResult").on('click', function () {
    window.location.href = chrome.runtime.getURL('popup.html');
});