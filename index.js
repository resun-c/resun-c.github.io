function goat(id) {
	let tag = document.getElementById(id);
	window.scroll({
		top: tag.offsetTop,
		left: tag.offsetLeft,
		behavior: 'smooth'
	});
}
	
function col_exp(tag, rtt_tag) {
	taggle_state(tag);
	rtt_tag.classList.toggle("_rotation_active");
	}
	
	function fit_height(tag) {
	var current_h = getComputedStyle(tag).height;
	tag.style.height = "fit-content";
	var actual_h = getComputedStyle(tag).height;
	tag.style.height = current_h;
	tag.offsetHeight;
	tag.style.height = actual_h;
}
	
function small_goat(id, tag) {
	let gtag = document.getElementById(id);
	let navh = document.getElementById("nav_small").offsetHeight;
	window.scroll({
		top: (gtag.offsetTop - navh),
		left: gtag.offsetLeft,
		behavior: 'smooth'
	});
	taggle_state(tag);
}
	
function taggle_state(tag) {
	if (tag.classList.contains("active")) {
		tag.style.height = 0;
		tag.classList.remove("active");
	} else {
		fit_height(tag);
		tag.classList.add("active");
	}
}
async function tw_print(s, tag) {
	const s_len = s.length;
	tag.innerHTML = "";

	var text = document.createElement("span");
	var cursor = document.createElement("span");
	cursor.innerHTML = "|";
	cursor.setAttribute("class", "typed-cursor typed-cursor--blink");
	
	tag.appendChild(text);
	tag.appendChild(cursor);

	for (let i = 0; i < s_len; i++) {
		await sleep(100);
		text.innerText += s[i];
	}
}
		
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}