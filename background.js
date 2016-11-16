var input = document.createElement('input');
document.body.appendChild(input);
var logging = true;
var clip_history = [];

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.warn("GOT EVENT:", request);
	if (request.event === 'copy' && logging) {
		input.focus();
		input.value = '';
		document.execCommand('paste');
		clip_history.push(input.value);
		console.warn("LOGGING", input.value);
	}
	else if (request.event === 'clear_history') {
		clip_history = [];
	}
	else if (request.event === 'save_history') {
		var el = document.createElement('a');
		el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(clip_history.join("\r\n")));
		el.setAttribute('download', 'clipboard.txt');
		document.body.appendChild(el);
		el.click();
		document.body.removeChild(el);
	}
	else if (request.event === 'set_logging_status') {
		logging = request.status;
	}
	else if (request.event === 'get_logging_status') {
		return sendRequest({ logging: logging });
	}
	else if (request.event === 'get_clipboard') {
		return sendResponse({ clipboard: clip_history });
	}
	sendResponse({});
});
