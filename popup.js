var logging = true;
window.addEventListener('load', function() {
	$('#clear_log').on('click', function(){ 
		console.warn("CLEAR CLICK");
		chrome.extension.sendRequest({ event: "clear_history" });
		return false;
	});	
	$('#save_log').on('click', function() {
		console.warn("SAVE CLICK");
		chrome.extension.sendRequest({ event: 'save_history' });
		return false;
	});
	$('#logging_status').on('change', function() {
		console.warn("STATUS CHANGE");
		var val = $('#logging_status').val();
		if (val === 'on') {
			chrome.extension.sendRequest({ event: "set_logging_status", status: true });
			logging = true;
		}
		else if (val === 'off') {
			chrome.extension.sendRequest({ event: "set_logging_status", status: false });
			logging = false;
		}
	});
	chrome.extension.sendRequest({ event: "get_logging_status" }, function(response) {
		console.warn("GETTING LOGGING STATUS:", response);
		if (response && response.logging) {
			$('#logging_status').val('on');
			logging = true;
		}
		else {
			$('#logging_status').val('off');
			logging = false;
		}
	});
	chrome.extension.sendRequest({ event: "get_clipboard" }, function(response) {
		console.warn("HERE:", response);
		if (response && response.clipboard && response.clipboard.length) {
			$(".clipboard_contents").html(response.clipboard.map(function(txt) {
				return "<div style='white-space: nowrap;'>" + txt + "</div>";
			}).join("<br>"));
		}
		else {
			$(".clipboard_contents").html("NO CONTENT");
		}
	});
});
