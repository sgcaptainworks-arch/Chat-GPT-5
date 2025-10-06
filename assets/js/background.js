if( typeof chrome.sidePanel === 'undefined'){
    chrome.action.onClicked.addListener(() => {
        chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
    });
} else{
    chrome.sidePanel
        .setPanelBehavior({ openPanelOnActionClick: true })
        .catch((error) => console.error(error));
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action !== 'openSidePanel')
        return false;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tabId = tabs[0].id;

        // потом открыть сайдпанель для этой вкладки
        chrome.sidePanel
            .open({ tabId: tabId })
            .then(() => { isPanelOpen = true })
            .catch((error) => {
                console.error("Error from sidebtn:", error);
            });

    });
});

const UNINSTALL_URL = "https://server.com/chatbot/uninstall";
chrome.runtime.setUninstallURL(UNINSTALL_URL);

const WELCOME_URL = "https://server.com/chatbot/welcome";
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: WELCOME_URL,
        });
    }
});

