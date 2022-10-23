(() => {
  let sparxTopBar;
  let currentBookworkCode = "";
  let currentBookworkCodes = [];

  const fetchBookworkCodes = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['store'], (obj) => {
        resolve(obj['store'] ? JSON.parse(obj['store']) : []);
      });
    });
  };


  const getAnswers = () => {
    const objAnswer = document.getElementsByClassName("number-input")
    console.log(objAnswer.length);
    if (objAnswer.length == 1) {
      return currentAnswers = objAnswer[0].value
    } else if (objAnswer.length == 2) {
      return currentAnswers = objAnswer[0].value + ', ' + objAnswer[1].value
    } else {
      return 'na'
    }
  }

  const addNewBookworkCodeHandler = async () => {
    const objBookworkCode = document.getElementsByClassName("bookwork-code bookwork-code-clickable")[0];
    if (objBookworkCode) {
      currentBookworkCode = objBookworkCode.getElementsByTagName("span")[0].innerText.substr(15, 3)
    } else {
      currentBookworkCode = 'na'
    }
    const currentAnswers = getAnswers()

    const newBookworkCode = {
      code: currentBookworkCode,
      desc: currentBookworkCode + ': ' + currentAnswers,
    }

    currentBookworkCodes = await fetchBookworkCodes();
    chrome.storage.sync.set({
      ['store']: JSON.stringify([...currentBookworkCodes, newBookworkCode])
    });
    currentBookworkCodes = [...currentBookworkCodes, newBookworkCode]
    return currentBookworkCodes
  };


  const newQuestionLoaded = async () => {
    const bookworkBtnExists = document.getElementsByClassName("bookwork-btn")[0];

    currentBookworkCodes = await fetchBookworkCodes();

    if (!bookworkBtnExists) {
      const bookworkBtn = document.createElement("img");

      bookworkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookworkBtn.className = "bookmark-btn";
      bookworkBtn.title = "Click to bookmark current timestamp";

      //sparxTopBar = document.getElementsByClassName("middle")[0]
      //youtubePlayer = document.getElementsByClassName('video-stream')[0];

      //sparxTopBar.appendChild(bookworkBtn);
      bookworkBtn.addEventListener("click", addNewBookworkCodeHandler);
    }
  };

  chrome.runtime.onMessage.addListener(async(obj, sender, response) => {
    const { type, value, bookworkCode } = obj;
    console.log(type)
    if (type === "NEWB") {
      currentBookworkCode = bookworkCode
      newQuestionLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
      currentBookworkCodes = currentBookworkCodes.filter((b) => b.time != value);
      chrome.storage.sync.set({ ['store']: JSON.stringify(currentBookworkCodes) });

      response(currentBookworkCodes);
    } else if (type === "DELETEALL") {
      currentBookworkCodes = [];
      chrome.storage.sync.set({ ['store']: JSON.stringify(currentBookworkCodes) });

      response(currentBookworkCodes);
    } else if (type === "ADD") {
      console.log('a')
      addNewBookworkCodeHandler().then(() => {
        response(true);
      });
      console.log('t')
      return true
    };
      
  });


  //newQuestionLoaded();
})();


const objBookworkCode = document.getElementsByClassName("bookwork-code bookwork-code-clickable");
if (objBookworkCode.length > 0) {
  currentBookworkCode = objBookworkCode[0].getElementsByTagName("span")[0].innerText.substr(15, 3);
  console.log(currentBookworkCode);
}
