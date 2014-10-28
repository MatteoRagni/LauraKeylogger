// Status.js
// This variable is used by the app to understand if capturing is running or not
var CAPTURING = __config.default_startup;

// Definitions only for debugging and test

/* DO NOT EDIT BELOW THIS LINE */

if (__config.__debug__) {

    function __print(mess) {
        console.log("[DEBUG] :: " + mess);
    }

    var __testing_obj = {
        time: {
            epoch: "epoch_time",
            localeDate: "locale_date",
            localeTime: "locale_time"
        },

        mouse: {
            x: "mouse_x",
            y: "mouse_y",
            xWin: "mouse_win_x",
            yWin: "mouse_win_y",
            evnt: "mouse_event",
            button: "mouse_button",
            target: "mouse_element_target"
        },

        keyboard: {
            string: "kbd_full_combination",
            key: "kbd_key",
            modifiers: "ctrl meta",
            ctrl: true,
            meta: true,
            alt: false,
            shift: false,
            keyCode: "0x100"
        },

        title: "PLEASE START CAPTURING!!"
    }

} else {
    function __print(mess) {}; 
    var __testing_obj = {};
}

// this function handle the capturing status (capturing status refer only to saving data in the textarea!)
function xorStatus() {
    obj = $("#statusSwitch");
    if (!CAPTURING) {
        CAPTURING = true;
        obj.prop("value","Running");
        obj.removeClass("btn-danger");
        obj.addClass("btn-success");
    } else {
        CAPTURING = false;
        obj.prop("value","Not Running");
        obj.removeClass("btn-success");
        obj.addClass("btn-danger");
    }
    // Send swithed status to the server
    chrome.runtime.sendMessage({protocol:"status", content:CAPTURING});
    n_StartStop(CAPTURING);
}

// Used to change the color of span object that identify modifiers
function modifierStatus(itemId, cond) {
    if (cond) {
        $(itemId).removeClass();
        $(itemId).addClass("label label-success");
    } else {
        $(itemId).removeClass();
        $(itemId).addClass("label label-info");
    }
}

// This script is used to populate objects in table. jQuery id selector used!
function populate(obj) {
    if (CAPTURING) {
        // Writing time of the capture
        $("#timeEpoch").html(obj.time.epoch);
        $("#timeLocale").html(obj.time.localeTime + " - " + obj.time.localeDate);
        // Writing title of the capture or hide title rows
        if (obj.title) {
            $(".cls-tr-title").show();
            $("#idTitle").html(obj.title);
        } else {
            $(".cls-tr-title").hide();
        }
        // Writing elements of mouse events if present
        if (obj.mouse) {
            $(".cls-tr-mouse").show();
            $("#mouseX").html(obj.mouse.x);
            $("#mouseY").html(obj.mouse.y);
            $("#mouseXWin").html(obj.mouse.xWin);
            $("#mouseYWin").html(obj.mouse.yWin);
            $("#mouseEv").html(obj.mouse.evnt);
            $("#mouseBtn").html(obj.mouse.button);
            $("#mouseTarget").html(obj.mouse.target);
        } else {
            $(".cls-tr-mouse").hide();
        }
        if (obj.keyboard) {
            $(".cls-tr-kbrd").show();
            $("#kbdKey").html(obj.keyboard.key + " - " + obj.keyboard.keyCode);
            modifierStatus("#kbdCtrl", obj.keyboard.ctrl);
            modifierStatus("#kbdAlt",obj.keyboard.alt);
            modifierStatus("#kbdShift",obj.keyboard.shift);
            modifierStatus("#kbdMeta",obj.keyboard.meta);
            $("#kbdComb").html(obj.keyboard.string);
        } else {
            $(".cls-tr-kbrd").hide();
        }
    }
}

// Setting on window opening startup status
chrome.runtime.onMessage.addListener(function(msg) {
    obj = $("#statusSwitch");
    if (msg.protocol === "running") {
        CAPTURING = msg.content;
        if (CAPTURING === true) {
            obj.prop("value","Running");
            obj.removeClass("btn-danger");
            obj.addClass("btn-success");
        } else {
            obj.prop("value","Not Running");
            obj.removeClass("btn-success");
            obj.addClass("btn-danger");
        }
    }
});

/*******************************/
/* INTERACTIONS                */
/*******************************/

$(document).ready( function() {

    chrome.runtime.sendMessage({protocol:"status", content:"set"});
    
    // Click function for statusSwitch
    $("#statusSwitch").click(function() {
        __print("clicked event! :: #statusSwitch");
        xorStatus();
    });

    // Click function for Show and Save (showInXML)
    $("#showInXML").click(function() {
        __print("clicked event! :: #showInXML");
        chrome.runtime.sendMessage({protocol:"window", content: "capture_show"});
    });

    // Click function for the screen capture elements
    $("#videoFeed").click(function() {
        __print("clicked event! :: #videoFeed");
        chrome.runtime.sendMessage({protocol:"window", content: "videoFeed_show"});
        //xorVideoFeed();
    });

});



