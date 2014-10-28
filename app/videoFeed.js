// Select button
var openStreamButton = document.querySelector('#openstream');
var recorderButton = document.querySelector('#recorder');
var downloadButton = document.querySelector('#downloadVideoFeed');

var RECORDER_STOP = "Stop";
var RECORDER_REC  = "Record";

var streamUrl = null;

var __debug = function(mess) {
	console.log("[DEBUG] :: " + mess);
}

var __Frames = function(name) {
	this.name = name;
	chrome.storage.local[this.name] = { frames: [] };
	this.push = function(frame) { chrome.storage.local[this.name].frames.push(frame); };
	this.get = function() {	return chrome.storage.local[this.name].frames; };
	this.getFrame = function(i) { return chrome.storage.local[this.name].frames[i]; };
	this.clear = function() { chrome.storage.local[this.name].frames = []; }
	this.length = function() { return chrome.storage.local[this.name].frames.length; }
}

var video = document.querySelector('video');
video.controls = false;

var canvas = document.querySelector('canvas');
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;
var ctx = canvas.getContext('2d');

var elapsedTime = document.querySelector('#elapsed-time');

navigator.getUserMedia = navigator.webkitGetUserMedia;
window.requestAnimationFrame = window.webkitRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame;
window.URL = window.webkitURL;

var rafId = null;
var startTime = null;
var endTime = null;
var frames = new __Frames("videoFeed");

function showStream(stream) { 
	// The timeout will set the dimensions for the rendering
	setTimeout(function() {
    	video.width = CANVAS_WIDTH;
    	video.height = CANVAS_HEIGHT;

      	canvas.width = video.width;
      	canvas.height = video.height;
    }, 500); 

	streamUrl = window.URL.createObjectURL(stream); 
	video.src = streamUrl;
}

function openStream(id) {
	if (!id) { __debug("ID not opened"); return; } else {
		navigator.getUserMedia(
			{ audio:false, video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: id } }}, 
			showStream,
			function() { __debug("Impossible to open the stream"); }
		);
		openStreamButton.disabled = false;
	}
}

function recordStream() {
	video.src = streamUrl;
	video.controls = false;

	frames.clear();

	startTime = Date.now();

	function saveVideoFrame(time) {
		rafId = requestAnimationFrame(saveVideoFrame);
		ctx.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		var url = canvas.toDataURL('image/webp', 1); 
    	frames.push(url);
	};
	rafId = requestAnimationFrame(saveVideoFrame);

	recorderButton.value = RECORDER_STOP;
}

function stopStream() {
	cancelAnimationFrame(rafId);
	endTime = Date.now();

	exportStream();
	recorderButton.value = RECORDER_REC;
}

function exportStream() {
    url = window.URL.createObjectURL(Whammy.fromImageArray(frames.get(), 1000 / 60));
  	
    video.src = url;
    video.controls = true;

    downloadButton.href = url;
    downloadButton.download = "screen-capture.webm";
}

function requestPermissionStream() {
	pending_request_id = chrome.desktopCapture.chooseDesktopMedia(["screen"], openStream);
}

// Setting the events!

$(document).ready( function() {
	$("#openstream").click(function() {
	    console.log("[DEBUG] :: Acquiring requested!");
	    requestPermissionStream();
	    recorderButton.disabled = false;

	});

	$('#recorder').click(function() {
		if (recorderButton.value == RECORDER_REC) {
			recordStream();
			recorderButton.value = RECORDER_STOP;
		} else if (recorderButton.value == RECORDER_STOP) {
			stopStream();
			recorderButton.value = RECORDER_REC;
		}
	});
});