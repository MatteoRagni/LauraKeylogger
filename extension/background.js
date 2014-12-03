// function to handle the values contained in the tabs.
var windowslog = new __Windows();
var keylog = null;

// Return time in human readable format
function __time() {
    var d = new Date();
    return d.toLocaleString();
}

function __printDebug(message) {
	if (__config.__debug__) { console.log(message); }
}

////// Message passing to external applications //////
var port = null;

function connectExternalApp() {
    if (!port) { 
        port = chrome.runtime.connect(__appID.app);
        port.postMessage({
           protocol: "log",
           content: "[" + __time() + " :: EXT] Establishing Connection. If you see this message the connection is established"
        });
        // null the port when connection disconnects
        port.onDisconnect.addListener(function() {
            port = null;
        });
    }
}

chrome.runtime.onMessage.addListener( function(msg) {
	if(msg.protocol == "report_event") {
		__printDebug("Message received from injecter!")
		//windowslog.refresh();
        windowslog.exec(msg.content);
	}
	if (msg.protocol === "show") {
        connectExternalApp("show");
        port.postMessage(msg);
    }
})

chrome.browserAction.onClicked.addListener( function() {
    console.log("[DEBUG] :: browserAction Clicked");
    chrome.runtime.sendMessage(__appID.app, {
        protocol: "window",
        content: "show_status"
    });
});

