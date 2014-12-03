// This file contains all the functions that are necessary to 
// create a dynamic list that adds windows informations to the status 
// window.

var __windowListGenerator = function() {
	this.windows = undefined;
	this.output = "";
	this.element = undefined;

	this.templates = {
		win: "<div class='list-group-item {{focused}}'>\n<h4 class='list-group-item-heading'>Window {{id}}</h4>\n<div class='list-group-item-text'>\n{{tabs}}\n</div>\n</div>\n",
		tab: '<div href="#" class="list-group-item {{active}}">\n<h5 class="list-group-item-heading">Tab: {{title}}</h5>\n<p class="list-group-item-text">\n{{title}} <br> \n{{url}}\n<span class="badge">{{status}}</span>\n</p>\n</div>\n',
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
					tabslist += this.templates.tab.replace(this.regexp.tab.active, (this.windows[i].tabs[j].active ? " list-group-item-info" : ""))
												  .replace(this.regexp.tab.title, this.windows[i].tabs[j].title)
												  .replace(this.regexp.tab.url,  this.windows[i].tabs[j].url)
												  .replace(this.regexp.tab.status,  this.windows[i].tabs[j].status);
				}
				windowlist += this.templates.win.replace(this.regexp.win.id, this.windows[i].id)
												.replace(this.regexp.win.focused, (this.windows[i].focused ? " list-group-item-info" : ""))
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
