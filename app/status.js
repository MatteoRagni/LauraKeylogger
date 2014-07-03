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
    }
}