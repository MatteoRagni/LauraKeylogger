chrome.browserAction.onClicked.addListener( function() {
    console.log("[DEBUG] :: browserAction Clicked");
    chrome.runtime.sendMessage(__appID.app, {
        protocol: "show",
        content: "show_status"
    });
});