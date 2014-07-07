// notifications.js - generates some notifications.

/*********************/
/* Notification List */
/*********************/

// Template for notificatio
n_tmpl = {
	type: "basic",
	iconUrl: "icons/icon128.png",
	title: "LauraKeyLogger",
	isClickable: false
};

function n_callback() {
	console.log("Notification Launched!")
}

// Notification start stop capturing
function n_StartStop(cap) {
	var content = n_tmpl;
	content.message = "Current capturing status: " + (cap ? "ENABLED" : "DISABLED");
	content.contextMessage = (new Date()).toLocaleString();
	chrome.notifications.create(__config.notificationID + "-" + Date.now(), content, function() {n_callback();});
}

// Notification copy to clipboard
function n_CopyClipboard() {
	var content = n_tmpl;
	content.message = "Text Copied to the Clipboard. Please paste it into an empty text file!"
	content.contextMessage = (new Date()).toLocaleString();
	chrome.notifications.create(__config.notificationID + "-" + Date.now(), content, function() {n_callback();});
}