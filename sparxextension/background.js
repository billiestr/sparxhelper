import { getActiveTabURL } from "./utils.js"
getActiveTabURL().then((c)=>{
  console.log(c.id);
});
/*
chrome.tabs.onUpdated.addListener((tabId, tab) => {


  if (tab.url && tab.url.includes("sparxmaths.uk/student") && currentTitle.includes(": Item ")) {
    console.log('a', currentBookworkCode)
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      bookmarkCode: currentBookworkCode,
    });
  }
});*/
