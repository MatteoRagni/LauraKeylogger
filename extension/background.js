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

// function readTabsStatus() {
// 	var __title = [];
// 	var __url = [];
// 	var __active = [];
// 	//var __zoom = []; // zoom cannot be inserted because zoom api belongs to dev channel!

//     chrome.tabs.query({}, function(tabs) {
// 		for (i = 0; i < tabs.length; i++) {
// 		    if (tabs[i].url.substring(0,5) != "chrome") {
// 		    var __t = {title:"", url:"", id:0, active:false, zoom:0.00};
		    
// 			    // Saving title, cut if longer of 25 char
// 			    if (tabs[i].title.length > 25) {
// 			        __t.title = tabs[i].title.substring(0,22) + "...";
// 			    } else {
// 			        __t.title = tabs[i].title;
// 			    }

// 			    // Saving URL, cut if longer of 25 char
// 			    if (tabs[i].url.length > 25) {
// 			        __t.url = tabs[i].url.substring(0,22) + "...";
// 			    } else {
// 			        __t.url = tabs[i].url;
// 			    }

// 			    //chrome.tabs.getZoom(tabs[i].id, function(z) {
// 			    //	__t.zoom = z;
// 			    //});

// 			    // Saving state, set to true if active
// 			    __t.active = tabs[i].active;
			    
// 			    __title.push(__t.title);
// 			    __url.push(__t.url);
// 			    __active.push(__t.active);
// 			    //__zoom.push(__t.zoom);
// 			}
// 		}
//     });
//     tabslog = { 
//     	title : __title, 
//     	url : __url,
//     	active : __active,
//     	//zoom : __zoom
//     };
// }

////// Message passing to external applications
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
		windowslog.refresh();

		// Sending the message to the external application!
		connectExternalApp("event");
		port.postMessage({
			protocol: "event",
			content: msg.content,
			windows: windowslog.get()
		});
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

