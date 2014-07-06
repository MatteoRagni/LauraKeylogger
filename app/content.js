// content.js

/*******************************/
/* INTERACTIONS                */
/*******************************/

$(document).ready( function() {
	// Click function for get xml standard
	$("#std-xml").click( function() {
		chrome.runtime.sendMessage({protocol:"show", content:"xml_std"});
	});
	$("#spss-xml").click( function() {
		chrome.runtime.sendMessage({protocol:"show", content:"xml_spss"});
	});
	$("#json").click( function() {
		chrome.runtime.sendMessage({protocol:"show", content:"json"});
	});
	$("#csv").click( function() {
		chrome.runtime.sendMessage({protocol:"show", content:"csv"});
	});
});