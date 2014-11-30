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

var TEST = function() {
	this.list = [];
	this.refresh = function() {
		this.list.push(1);
	}
}

var __Windows = function() {

	this.winlist = [];

	// This function refreshes the status of the windows structure that we use
	this.refresh = function() {
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
							__title = windows[i].tabs[j].title.split(0,22) + "...";
						} else {
							__title = windows[i].tabs[j].title;
						}
						// Shortens the url if greater than 25 char
						if (windows[i].tabs[j].url.length > 25) {
							__url = windows[i].tabs[j].url.split(0,22) + "...";
						} else {
							__url = windows[i].tabs[j].url;
						}

						__tablist.push({
							index       : windows[i].tabs[j].index,
							active      : windows[i].tabs[j].active,
							pinned      : windows[i].tabs[j].pinned,
							highlighted : windows[i].tabs[j].highlighted,
							title       : __title,
							url         : __url,
							status		:  windows[i].tabs[j].status
						});
					}

					// Add elements to the winlist
					__winlist.push({
						id          : windows[i].id,
						focused     : windows[i].focused,
						geometry    : { top : windows[i].left, left : windows[i].left, width : windows[i].width, height : windows[i].height },
						incognito   : windows[i].incognito,
						type        : windows[i].type,
						alwaysOnTop : windows[i].alwaysOnTop,
						tabs        : __tablist
					});
				}
			}

		});
		
		this.winlist = __winlist;
	};

	this.get = function() {
		this.refresh();
		return this.winlist;
	} 

	// Get all the values on creation
	this.refresh();
}