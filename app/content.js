// content.js

function dataElaboration() {
	$('#data_container').html("Elaborating the request this will take some time . . .");
}

/*******************************/
/* INTERACTIONS                */
/*******************************/

$(document).ready( function() {
	// Click function for get xml standard
	$("#std-xml").click( function() {
		dataElaboration();
		chrome.runtime.sendMessage({protocol:"show", content:"xml_std"});
	});
	// Click function for get spss ready xml
	$("#spss-xml").click( function() {
		dataElaboration();
		chrome.runtime.sendMessage({protocol:"show", content:"xml_spss"});
	});
	// function to get a JSON version of colected data
	$("#json").click( function() {
		dataElaboration();
		chrome.runtime.sendMessage({protocol:"show", content:"json"});
	});
	// function to collected csv file
	$("#csv").click( function() {
		dataElaboration();
		chrome.runtime.sendMessage({protocol:"show", content:"csv"});
	});

	// Copy to clipboard data
	$('#copy').click( function() {
		$('#data_container').select();
		document.execCommand('copy');
		n_CopyClipboard();
	});


});