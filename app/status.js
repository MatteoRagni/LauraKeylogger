// Status.js

 // This variable is used by the app to understand if capturing is running or not
var CAPTURING = false;

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
        	$(".cls-tr-title").prop("hidden","false");
        	$("#idTitle").html(obj.title);
        } else {
        	$(".cls-tr-title").prop("hidden","true");
        }
        // Writing elements of mouse events if present
        if (obj.mouse) {
        	$(".cls-tr-mouse").prop("hidden","false");
        	$("#mouseX").html(obj.mouse.x);
        	$("#mouseY").html(obj.mouse.x);
        	$("#mouseEv").html(obj.mouse.evnt);
        	$("#mouseBtn").html(obj.mouse.button);
        } else {
        	$(".cls-tr-mouse").prop("hidden","true");
        }
        if (obj.keyboard) {
        	$(".cls-tr-kbrd").prop("hidden","false");
        	$("#kbdKey").html(obj.keyboard.string + " - " + obj.keyboard.keyCode);
        	modifierStatus("#kbdCtrl", obj.keyboard.ctrl);
        }
    }
}

