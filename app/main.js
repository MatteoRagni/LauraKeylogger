// ******** do not edit below this line *********

// This variable decides if logging is enabled or not!
var CAPTURING = false;

// Create the page that draw actual keylogging informations
//var documentWin = null;
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('status.html', __config.opt_window);
});

var Keylogger = function() {
    
    // In this local file will be saved all collected data
    this.file = new __File("events");

    // The object is created with null variables
    this.time = { epoch: 0, obj: new Date(0) };
    this.title = null;
    this.mouse = null;
    this.keyboard = null;
    
    // Select if log in console or not
    this.loginconsole = false;

    // This function is called with the content of the message from the extension
    this.update = function(content) {
        this.time = { epoch: content.time, obj: new Date(content.time) };
        if (content.config.opt_title) { this.title = content.title; } else { this.title = null; }
        if (content.config.opt_mouse) { this.mouse = content.mouse; } else { this.mouse = null; }
        if (content.config.opt_keyboard) { this.keyboard = content.keyboard; } else { this.keyboard = null; }

        // Add an element to the file
        this.file.push(this.get());
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
            xWin: x position of the mouse with respect to window
            yWin: y position of the mouse with respect to window
            evnt: event that was triggered
            button: eventually clicked button
            target: clicked element reported by eventHandler
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
        if (this.loginconsole) {
            var log = '\n';
            
            // Logging time
            log += "Time: " + this.time.obj.toLocaleString() + " [" + this.time.epoch + "]" + '\n';
            
            // if defined, logging title
            if (this.title) { log += "Title: " + this.title + '\n';}
            if (this.mouse) {
                log += "Mouse:" + '\n';
                log += '\t' + "X: " + this.mouse.x + '\n';
                log += '\t' + "Y:" + this.mouse.y + '\n';
                log += '\t' + "xWin:" + this.mouse.xWin + '\n';
                log += '\t' + "yWin:" + this.mouse.yWin + '\n';
                log += '\t' + "Event: " + this.mouse.evnt + '\n';
                log += '\t' + "Button: " + this.mouse.button + '\n';
                log += '\t' + "Target:" + this.mouse.target + '\n';
            }
            if (this.keyboard) {
                log += "Keyboard:" + this.keyboard.string + '\n';
            }
            console.log(log);
        }
    }

    // This function convert the whole object saved in an xml string
    this.getXML = function() {

        var data = this.file.get();

        var xml = "<?xml version='1.0'?>" + "\n" + "<events>" + "\n";
        for (var i = 0; i < data.events.length; i++) {
            var event = data.events[i];
            
            // Timing informations
            var xmlev = "  <event>" + "\n" + 
                "    <time>" + "\n" +
                "      <epoch>" + event.time.epoch + "</epoch>" + "\n" +
                "      <locale>" + event.time.localeTime + " - " + event.time.localeDate + "</locale>" + "\n" +
                "    </time>" + "\n";
            
            // Page informations
            if (event.title) {
                xmlev += "  <title>" + event.title + "</title>" + "\n";
            }    

            // Mouse events
            if (event.mouse) {
                xmlev += "    <mouse>" + "\n" +
                         "      <x>" + event.mouse.x + "</x>" + "\n" +
                         "      <y>" + event.mouse.y + "</y>" + "\n" +
                         "      <xWin>" + event.mouse.xWin + "</xWin>" + "\n" +
                         "      <yWin>" + event.mouse.yWin + "</yWin>" + "\n" +
                         "      <button>" + event.mouse.button + "</button>" + "\n" +
                         "      <type>" + event.mouse.evnt + "</type>" + "\n" +
                         "      <target>" + event.mouse.target + "</target>" + "\n" +
                         "    </mouse>" + "\n";
            }

            // Keyboard events
            if (event.keyboard) {
                xmlev += "    <keyboard>"  + "\n" + 
                         "      <keycode>" + event.keyboard.keycode + "<keycode>"  + "\n" +
                         "      <key>" + event.keyboard.key + "</key>" + "\n" +
                         "      <ctrl>" + event.keyboard.ctrl + "</ctrl>" + "\n" +
                         "      <alt>" + event.keyboard.alt + "</alt>" + "\n" +
                         "      <shift>" + event.keyboard.shift + "</shift>" + "\n" +
                         "      <meta>" + event.keyboard.meta + "</meta>" + "\n" +
                         "      <combination>" + event.keyboard.string + "</combination>" + "\n" +
                         "    </keyboard>" + "\n";

            }
            xmlev += "  </event>" + "\n";

            xml += xmlev;

        }
        xml += "</events>"
        return xml;
    }

    // This function will generate an spss consistent xml file
    this.getXML_SPSS = function() {
        
        var data = this.file.get();

        // Header preparation
        var xml  = "<spssfile>" + "\n" + 
                   "  <variable>" + "\n" +
                   "    <numeric name='epoch' decimal='0' label='Time of the event' />" + "\n" +
                   "    <string name='localeTime' legth='64' label='Locale string for time' />" + "\n" +
                   "    <string name='localeDate' legth='64' label='Locale string for date' />" + "\n";

        if (data.events[0].title) {
            xml += "    <string name='title' legth='2048' label='Title of the page' />" + "\n";
        }          

        if (data.events[0].mouse) {
            xml += "    <numeric name='x' decimal='0' label='X posistion of the mouse' />" + "\n" +
                   "    <numeric name='y' decimal='0' label='Y position of the mouse' />" + "\n" +
                   "    <numeric name='xWin' decimal='0' label='X position of the mouse in window' />" + "\n" +
                   "    <numeric name='yWin' decimal='0' label='Y position of the mouse in window' />" + "\n" +
                   "    <string name='type' legth='32' label='Type of mouse event' />" + "\n" + 
                   "    <string name='button' legth='32' label='Mouse button pressed' />" + "\n" + 
                   "    <string name='target' legth='2048' label='Element clicked' />" + "\n";
        }

        if (data.events[0].keyboard) {
            xml += "    <string name='keycode' legth='32' label='Keycode relative to key pressed' />" + "\n" + 
                   "    <string name='key' legth='32' label='Key pressed' />" + "\n" + 
                   "    <string name='combination' legth='64' label='Combination of key pressed with modifiers' />" + "\n" + 
                   "    <numeric name='ctrl' decimal='0' label='ctrl modifier pressed' />" + "\n" +
                   "    <numeric name='alt' decimal='0' label='alt modifier pressed' />" + "\n" +
                   "    <numeric name='shift' decimal='0' label='shift modifier pressed' />" + "\n" +
                   "    <numeric name='meta' decimal='0' label='meta modifier pressed' />" + "\n";
        }
        xml += "  </variable>" + "\n" + "\n" +
               "  <data>" + "\n";

        // Adding data
        for (var i = 0; i < data.events.length; i++) {
                var event = data.events[i];
                xml += "    <row>" + "\n";

                xml += "      <value>" + event.time.epoch + "</value>" + "\n" + 
                       "      <value>" + event.time.localeTime + "</value>" + "\n" + 
                       "      <value>" + event.time.localeDate + "</value>" + "\n";

            if (data.events[0].title) {
                xml += "      <value>" + event.title + "<value>" + "\n";
            }

            if (data.events[0].mouse) {
                xml += "      <value>" + event.mouse.x + "<value>" + "\n" +
                       "      <value>" + event.mouse.y + "</value>" + "\n" +
                       "      <value>" + event.mouse.xWin + "</value>" + "\n" +
                       "      <value>" + event.mouse.yWin + "</value>" + "\n" +
                       "      <value>" + event.mouse.evnt + "</value>" + "\n" +
                       "      <value>" + event.mouse.button + "</value>" + "\n" +
                       "      <value>" + event.mouse.target + "</value>" + "\n";
            }

            if (data.events[0].keyboard) {
                xml += "      <value>" + event.keyboard.keyCode + "<value>" + "\n" +
                       "      <value>" + event.keyboard.key + "</value>" + "\n" +
                       "      <value>" + event.keyboard.string + "</value>" + "\n" +
                       "      <value>" + (event.keyboard.ctrl ? "1" : "0") + "</value>" + "\n" +
                       "      <value>" + (event.keyboard.alt ? "1" : "0") + "</value>" + "\n" +
                       "      <value>" + (event.keyboard.shift ? "1" : "0") + "</value>" + "\n" +
                       "      <value>" + (event.keyboard.meta ? "1" : "0") + "</value>" + "\n";
            }

                xml += "    </row>" + "\n";
        }

        xml += "  </data>" + "\n" + "</spssfile>";
        return xml;

    }

    this.get_csv = function() {
        var data = this.file.get();      

        // Header preparation
        var csv = "# epoch, locale time, locale date";
        csv += (data.events[0].mouse ? ", x, y, xWin, yWin, type, button, target" : "");
        csv += (data.events[0].keyboard ? ", keyCode, key, combination, ctrl, alt, shift, meta" : "");
        csv += (data.events[0].title ? ", title" : "");
        csv += "\n \n";

        // Data collection
        for (var i = 0; i < data.events.length; i++) {
            var event = data.events[i];
            csv += event.time.epoch + "," + event.time.localeTime + "," + event.time.localeDate;
            csv += ( event.mouse ? "," + event.mouse.x + "," + event.mouse.y + "," + event.mouse.xWin + "," + event.mouse.yWin + "," + event.mouse.evnt + "," + event.mouse.button + "," + event.mouse.target : "" );
            csv += ( event.keyboard ? "," + event.keyboard.keyCode + "," + event.keyboard.key + "," + event.keyboard.string + "," + (event.keyboard.ctrl ? "1" : "0") + "," + (event.keyboard.alt ? "1" : "0") + "," + (event.keyboard.shift ? "1" : "0") + "," + (event.keyboard.meta ? "1" : "0") : "" );
            csv += ( event.title ? "," + event.title : "" );
            csv += "\n";
        }
        return csv;
    }

    this.get_JSON = function() {
        return "JSON Not Implemented Yet!";
    }
    
    this.updateWindow = function() {
        if (chrome.app.window.get(__config.opt_window.id)) {
            (chrome.app.window.get(__config.opt_window.id)).contentWindow.populate(this.get());
        }
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
        if (CAPTURING) {
            keylog.update(msg.content);
            keylog.consoleLog();
            keylog.updateWindow();
        }
    }

    // implementation of open windows messages
    if (msg.protocol === "window") {
        switch (msg.content) {
        case "capture_show": // Open the output window
                if (!(chrome.app.window.get(__config.out_window.id))) {
                   chrome.app.window.create('content.html', __config.out_window);   
                }
                break;
        case "videoFeed_show": // Open video feed window
            if (!(chrome.app.window.get(__config.out_window.id))) {
               chrome.app.window.create('videoFeed.html', __config.videoFeed_window);   
            }
            break;
        case "show_status":
            if (!(chrome.app.window.get(__config.opt_window.id))) {
                chrome.app.window.create('status.html', __config.opt_window);
            }
            break;
        }
    }

    // implementation of protocol show
    if (msg.protocol === "show") {
        var dataExport = { ext: "", data: "" };
        switch (msg.content) {
            case "xml_std": // write xml in output window
                dataExport.data = keylog.getXML();
                dataExport.ext = "xml";               
                break;
            case "xml_spss": // write xml in output window
                dataExport.data = keylog.getXML_SPSS();
                dataExport.ext = "xml";
                
                break;
            case "json": // write xml in output window
                dataExport.data = keylog.get_JSON();
                dataExport.ext = "json";
                break;
            case "csv": // write xml in output window
                dataExport.data = keylog.get_csv();
                dataExport.ext = "csv";
                break;
        }
        (chrome.app.window.get(__config.out_window.id)).contentWindow.document.getElementById("data_container").innerHTML = dataExport.data;
        (chrome.app.window.get(__config.out_window.id)).contentWindow.document.getElementById("download").setAttribute('download', 'experiment_data.' + dataExport.ext);
        (chrome.app.window.get(__config.out_window.id)).contentWindow.document.getElementById("download").setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataExport.data));
    }

    if (msg.protocol === "clear_data") {
        if (msg.content === "clear_confirmed") {
            __printDebug("Request for data clearing! Request Accepted! DATA CLEARED");
            keylog.file.clear();
        }
    }

    // Define the capturing status, enabled if true, disabled if false. 
    // This will stop the calling of keylog update function
    if (msg.protocol === "status") {
        if (msg.content === "set") {
            chrome.runtime.sendMessage({protocol: "running", content: CAPTURING});
            __printDebug("Sent capturing status: " + CAPTURING);
        } else {
            CAPTURING = msg.content;
            __printDebug("Capturing status set to: " + CAPTURING);
        }
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

chrome.runtime.onMessage.addListener(function(msg) {
    connectionMessage(msg);
});

chrome.runtime.onMessageExternal.addListener(
  function(msg, sender) {
    if (sender.id === __appID.ext) {
       connectionMessage(msg); 
    }
});