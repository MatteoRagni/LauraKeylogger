chrome.browserAction.onClicked.addListener( function() {
    console.log("[DEBUG] :: browserAction Clicked");
    chrome.runtime.sendMessage(__appID.app, {
        protocol: "window",
        content: "show_status"
    });
});