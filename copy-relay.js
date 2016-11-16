function on_copy(event) {
	chrome.extension.sendRequest({ event: "copy" });
}

document.addEventListener('copy', on_copy, true);
