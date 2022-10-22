import {getActiveTabURL} from "./utils.js"

// adding a new bookworkCodes row to the popup
const addNewBookworkCode = (bookworkCodesElement, bookworkCode) => {
    const bookworkTitleElement = document.createElement("div");
    const controlsElement = document.createElement("div");
    const newBookworkCodeElement = document.createElement("div");

    bookworkTitleElement.textContent = bookworkCode.desc;
    bookworkTitleElement.className = "bookwork-title";

    controlsElement.className = "bookwork-controls";
    setBookworkAttributes("add", onAdd, controlsElement);

    newBookworkCodeElement.id = "bookwork-" + bookworkCode.desc;
    newBookworkCodeElement.className = "bookworkCode";
    newBookworkCodeElement.setAttribute("desc", bookworkCode.desc);

    newBookworkCodeElement.appendChild(bookworkTitleElement);
    bookworkCodesElement.appendChild(newBookworkCodeElement);
};

const viewBookworkCodes = (currentBookworkCodes=[]) => {
    console.log(currentBookworkCodes);
    const bookworkCodesElement = document.getElementById("bookworkCodes");
    bookworkCodesElement.innerHTML = "";
    console.log(currentBookworkCodes.length);
    if (currentBookworkCodes.length > 0) {
        for ( let i = 0; currentBookworkCodes.length; i++) {
            const bookworkCode = currentBookworkCodes[i];
            console.log(bookworkCode)
            addNewBookworkCode(bookworkCodesElement, bookworkCode)
        }
    } else {
        bookworkCodesElement.innerHTML = '<i class="row">No bookwork codes to show.</i>'
    }
};

const onPlay = e => {};

const onAdd = async e => {
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(activeTab.id, {
      type: "ADD",
      value: 'na',
    }, viewBookworkCodes);
  };
  

const onDelete = e => {};

const onDeleteAll = async e => {
    const activeTab = await getActiveTabURL();
    console.log(activeTab.id)
    chrome.tabs.sendMessage(activeTab.id, {
      type: "DELETEALL",
      value: 'na',
    }, viewBookworkCodes);
    const divlist = document.getElementsByClassName("bookworkCode")
    for (let i = 0; i < divlist.length; i++) {
        var elem = divlist[i];
        console.log(elem);
        elem.remove();
    }
};

const setBookworkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    console.log('sbma')
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
    document.getElementsByClassName("container")[0].appendChild(controlParentElement);
  };


document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    console.log("DOMContentLoaded!!")


    if(activeTab.url.includes("sparxmaths.uk/student")) {
        chrome.storage.sync.get(['store'], (data) => {
            const currentBookworkCodes = data['store'] ? JSON.parse(data['store']):[];

            viewBookworkCodes(currentBookworkCodes);
        })
    } else {
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class="title">Not a Sparx Student Page.</div>';
    }
});

const controls = document.getElementById("controls");

const bookworkTitleElement = document.createElement("div");
const controlsElement = document.createElement("div");
const newControlsElement = document.createElement("div");

bookworkTitleElement.textContent = 'Add new bookwork / Delete all';
bookworkTitleElement.className = "bookwork-title";
controlsElement.className = "bookwork-controls";

setBookworkAttributes("add", onAdd, controlsElement);
setBookworkAttributes("deleteAll", onDeleteAll, controlsElement);

newControlsElement.id = "controls-";
newControlsElement.className = "controls";

newControlsElement.appendChild(bookworkTitleElement);
newControlsElement.appendChild(controlsElement);
controls.appendChild(newControlsElement);