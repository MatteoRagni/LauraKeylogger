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
		n_notImplemented();
	});
	// function to get a JSON version of colected data
	$("#json").click( function() {
		dataElaboration();
		chrome.runtime.sendMessage({protocol:"show", content:"json"});
		n_notImplemented();
	});
	// function to collected csv file
	$("#csv").click( function() {
		dataElaboration();
		chrome.runtime.sendMessage({protocol:"show", content:"csv"});
		n_notImplemented();
	});

	// Copy to clipboard data
	$('#copy').click( function() {
		$('#data_container').select();
		document.execCommand('copy');
		n_CopyClipboard();
	});

	// Enable Clear button
	$('#clear0').click( function() {
		$('#clear1').prop('disabled',false);
		setTimeout( function() { $('#clear1').prop('disabled',true); }, 2000);
	});

	// Clearing DATA
	$('#clear1').click( function() {
		$('#clear1').prop('disabled',true);
		$('#data_container')[0].innerHTML = "All data have been cleared!";
		chrome.runtime.sendMessage({protocol:"clear_data", content:"clear_confirmed"});
	});	


});