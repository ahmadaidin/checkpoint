// @ts-nocheck
export async function getCurrentTabUrl() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	if (chrome.tabs === undefined) {
		return window.location.href;
	}
	let [tab] = await chrome.tabs.query(queryOptions);
	if (tab) {
		return tab.url;
	}
	throw new Error('Cannot get current tab url');
}
