// This file contains all the functions that are necessary to 
// create a dynamic list that adds windows informations to the status 
// window.

var __windowListGenerator = function() {
	this.windows = undefined;
	this.output = "";
	this.element = undefined;

	this.templates = {
		win: "<div class='list-group-item {{focused}}'>\n<h5 class='list-group-item-heading'>Window {{id}} <small>@({{top}}px,{{left}}px), WxH({{width}}px,{{height}}px)</small></h5>\n<div class='list-group-item-text'>\n{{tabs}}\n</div>\n</div>\n",
		tab: '<div href="#" class="list-group-item {{active}}">\n<h6 class="list-group-item-heading">Tab: {{title}}</h6>\n<p class="list-group-item-text"><samp>{{url}}</samp> <span class="label label-info">{{status}}</span>\n</p>\n</div>\n',
		content :'<div class="list-group">\n{{window}}\n</div>\n'
	};

	this.regexp = {
		content: {
			window: /{{window}}/g
		},
		win: {
			focused: /{{focused}}/g,
			id: /{{id}}/g,
			tabs: /{{tabs}}/g,
			top: /{{top}}/g,
			left: /{{left}}/g,
			width: /{{width}}/g,
			height: /{{height}}/g,
		},
		tab: {
			active: /{{active}}/g,
			title: /{{title}}/g,
			url: /{{url}}/g,
			status: /{{status}}/g
		}
	}

	this.parser = function(event) {
		if (event) {
			this.windows = event.windows; 
			var windowlist = "";
			for (var i = 0; i < this.windows.length; i++) {
				var tabslist = "";
				for (var j = 0; j < this.windows[i].tabs.length; j++) {
					var status = ""
					if (this.windows[i].tabs[j].active) {
						if (this.windows[i].focused) {
							status = " list-group-item-success";
						} else {
							status = " list-group-item-info";
						}
					}
					tabslist += this.templates.tab.replace(this.regexp.tab.active, status)
												  .replace(this.regexp.tab.title, this.windows[i].tabs[j].title)
												  .replace(this.regexp.tab.url,  this.windows[i].tabs[j].url)
												  .replace(this.regexp.tab.status,  this.windows[i].tabs[j].status);
				}
				windowlist += this.templates.win.replace(this.regexp.win.id, this.windows[i].id)
												.replace(this.regexp.win.top, this.windows[i].geometry.top)
												.replace(this.regexp.win.left, this.windows[i].geometry.left)
												.replace(this.regexp.win.width, this.windows[i].geometry.width)
												.replace(this.regexp.win.height, this.windows[i].geometry.height)
												.replace(this.regexp.win.focused, (this.windows[i].focused ? " list-group-item-success" : ""))
												.replace(this.regexp.win.tabs, tabslist);

			}
			this.output = this.templates.content.replace(this.regexp.content.window, windowlist);
			if (this.element) {
				this.element.empty();
				this.element.append(this.output);

			}
		}
	}

}
