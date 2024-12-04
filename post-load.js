window.addEventListener("load", () => {
	document.querySelectorAll("[get-fit-height]").forEach((get_fit_height) => {
		set_fit_height(get_fit_height);
	});
	
	document.querySelectorAll("[hscroll]").forEach((hscroll) => {
		set_h_scroller(hscroll);
	});
	
	(new MutationObserver(body_custom_stylings)).observe(document, {
		attributes: true,
		childList: true,
		subtree: true,
		characterData: false,
	});
});