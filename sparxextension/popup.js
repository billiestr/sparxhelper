import { getActiveTabURL } from "./utils.js"

// adding a new bookworkCodes row to the popup
const addNewBookworkCode = (bookworkCodesElement, bookworkCode) => {
    const bookworkTitleElement = document.createElement("div");
    const controlsElement = document.createElement("div");
    const newBookworkCodeElement = document.createElement("div");

    bookworkTitleElement.textContent = bookworkCode.desc;
    bookworkTitleElement.className = "bookwork-title";

    controlsElement.className = "bookwork-controls";
    setBookworkAttributes("delete", onDelete, controlsElement);

    newBookworkCodeElement.id = "bookwork-" + bookworkCode.desc;
    newBookworkCodeElement.className = "bookworkCode";
    newBookworkCodeElement.setAttribute("desc", bookworkCode.desc);

    bookworkTitleElement.appendChild(controlsElement);
    newBookworkCodeElement.appendChild(bookworkTitleElement);
    bookworkCodesElement.appendChild(newBookworkCodeElement);
};

const viewBookworkCodes = (currentBookworkCodes) => {
    console.log(currentBookworkCodes);
    const bookworkCodesElement = document.getElementById("bookworkCodes");
    bookworkCodesElement.innerHTML = "";
    if (currentBookworkCodes && currentBookworkCodes.length > 0) {
        for (let i = 0; i < currentBookworkCodes.length; i++) {
            const bookworkCode = currentBookworkCodes[i];
            console.log(bookworkCode)
            addNewBookworkCode(bookworkCodesElement, bookworkCode)
        }
    } else {
        bookworkCodesElement.innerHTML = '<i class="row">No bookwork codes to show.</i>'
    }
};

const onPlay = e => { };

/**
 * Promise wrapper for chrome.tabs.sendMessage
 * @param tabId
 * @param item
 * @returns {Promise<any>}
 */
const sendMessagePromise = (tabId, item) => {
    const mPromise = new Promise(async(resolve, reject) => {
        await chrome.tabs.sendMessage(tabId, { item }, response => {
            console.log('aftermessage')
            console.log(response);
            if (response) {
                resolve('Yippee');
            } else {
                reject('Something wrong');
            }
        });
    });
    console.log('b')
    return mPromise
}

const onAdd = async e => {
    const activeTab = await getActiveTabURL();
    const mPromise = sendMessagePromise(activeTab.id, {
        type: "ADD",
        value: 'na',
    });
    console.log('d')
    mPromise.then((v) => {
        console.log(v)
        viewBookworkCodes(currentBookworkCodes);
    });

};


const onDelete = e => { };

const onDeleteAll = async e => {
    const activeTab = await getActiveTabURL();
    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETEALL",
        value: 'na',
    }, viewBookworkCodes);
};

const setBookworkAttributes = (src, eventListener, controlParentElement) => {
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


    if (activeTab.url.includes("sparxmaths.uk/student")) {
        chrome.storage.sync.get(['store'], (data) => {
            const currentBookworkCodes = data['store'] ? JSON.parse(data['store']) : [];

            viewBookworkCodes(currentBookworkCodes);
        })
    } else {
        const container = document.getElementsByClassName("container")[0];

        container.innerHTML = '<div class="title">Not a Sparx Student Page.</div>';
    }
});

const controls = document.getElementById("main-controls");

const bookworkTitleElement = document.createElement("div");
const controlsElement = document.createElement("div");
//const newControlsElement = document.createElement("div");

bookworkTitleElement.textContent = 'Add new bookwork / Delete all';
bookworkTitleElement.className = "main-title";
controlsElement.className = "main-buttons";

setBookworkAttributes("add", onAdd, controlsElement);
setBookworkAttributes("deleteAll", onDeleteAll, controlsElement);

//newControlsElement.id = "controls-top";
//newControlsElement.className = "controls-top";

bookworkTitleElement.appendChild(controlsElement);
//newControlsElement.appendChild(controlsElement);
controls.appendChild(bookworkTitleElement);