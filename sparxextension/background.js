const getBookworkCode = () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "GBWC", na: "na"}, function(response) {
          return response
    });
  });
};

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  console.log('aaa')

  if (tab.url && tab.url.includes("sparxmaths.uk/student") && currentTitle.includes(": Item ")) {
    
    const currentBookworkCode = getBookworkCode();
    
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      bookmarkCode: currentBookworkCode,
    });
  }
});
