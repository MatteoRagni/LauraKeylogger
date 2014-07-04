// Storage.js - This script shall save values in local storage of Chrome... 
// or at least I hope

var __File = function(name) {


	/*
	Structure of the saved blob

	{ 
		events: [
			{
				time: ...
				title: ...
				mouse: ...
				keyboard: ...
			},
			{
				time: ...
				title: ...
				mouse: ...
				keyboard: ...
			},
			...
		]
	}

	*/

	this.name = name;

	// creating a new variable in local storage
	chrome.storage.local[this.name] = { events: [] };

	this.push = function(obj) { 
		chrome.storage.local[this.name].events.push(obj);
	}

	this.get = function() {
		return chrome.storage.local[this.name];
	}
}

// Handle the JS object and transforms it in a XML