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
      if ( objAnswer.length == 1) {
        return currentAnswers = objAnswer[0].value
      } else {
        return currentAnswers = objAnswer[0].value + ', ' + objAnswer[1].value
      }
    }

    const addNewBookworkCodeHandler = async () => {
      const objBookworkCode = document.getElementsByClassName("bookwork-code bookwork-code-clickable")[0];
      const currentBookworkCode = objBookworkCode.getElementsByTagName("span")[0].innerText.substr(15, 3)

      const currentAnswers = getAnswers()
      
      const newBookworkCode = {
        code: currentBookworkCode,
        desc: currentBookworkCode + ': ' + currentAnswers,
      }

      currentBookworkCodes = await fetchBookworkCodes();
      console.log(currentBookworkCodes)
      console.log(JSON.stringify([...currentBookworkCodes, newBookworkCode]));
      chrome.storage.sync.set({
        ['store']: JSON.stringify([...currentBookworkCodes, newBookworkCode])
      });
    };

  
    const newQuestionLoaded = async () => {
      const bookworkBtnExists = document.getElementsByClassName("bookwork-btn")[0];
  
      currentBookworkCodes = await fetchBookworkCodes();
  
      if (!bookworkBtnExists) {
        const bookworkBtn = document.createElement("img");
  
        bookworkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
        bookworkBtn.className = "ytp-button " + "bookmark-btn";
        bookworkBtn.title = "Click to bookmark current timestamp";
  
        //sparxTopBar = document.getElementsByClassName("middle")[0]
        //youtubePlayer = document.getElementsByClassName('video-stream')[0];
  
        //sparxTopBar.appendChild(bookworkBtn);
        bookworkBtn.addEventListener("click", addNewBookworkCodeHandler);
      }
    };
    
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.type === "GBWC"){
          document.getElementsByClassName("bookwork-code bookwork-code-clickable")[0];
          const currentBookworkCode = objBookworkCode.getElementsByTagName("span")[0].innerText.substr(15, 3)
          sendResponse(currentBookworkCode);
        };
      }
    );

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, value, bookworkCode } = obj;
      console.log(type)
      if (type === "NEWB") {
        currentBookworkCode = bookworkCode
        newQuestionLoaded();
      } else if (type === "PLAY") {
        youtubePlayer.currentTime = value;
      } else if ( type === "DELETE") {
        currentBookworkCodes = currentBookworkCodes.filter((b) => b.time != value);
        chrome.storage.sync.set({ ['store']: JSON.stringify(currentBookworkCodes) });
  
        response(currentBookworkCodes);
      } else if ( type === "DELETEALL") {
        currentBookworkCodes = [];
        chrome.storage.sync.set({ ['store']: JSON.stringify(currentBookworkCodes) });
  
        response(currentBookworkCodes);
      } else if ( type === "ADD") {
        addNewBookworkCodeHandler();
        
        response(currentBookworkCodes);
      }

    });
  
    //newQuestionLoaded();
  })();
  
  const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
  
    return date.toISOString().substr(11, 8);
  };

const objBookworkCode = document.getElementsByClassName("bookwork-code bookwork-code-clickable")[0];
const currentBookworkCode = objBookworkCode.getElementsByTagName("span")[0].innerText.substr(15, 3);
console.log(currentBookworkCode);