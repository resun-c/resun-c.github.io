document.onmouseup = change_selected_text_color;
document.onkeyup = change_selected_text_color;
const root = document.querySelector(':root');
const selected_text_colors = [
	"#4dff4d",	// green
	"#ffeb3b",	// yellow
	"#1e90ff",	// dodger blue
	"#f44336",	// red
	"#00ffff",	// azure
	"#7fffd4",	// aquamarine
]
const selected_text_colors_len = selected_text_colors.length;
var current_selected_text_color_index;
function change_selected_text_color() {
	let i = Math.floor(Math.random() * (selected_text_colors_len));
	while (i == current_selected_text_color_index) {
		i = Math.floor(Math.random() * (selected_text_colors_len));
	}
	root.style.setProperty("--selected_text_color", selected_text_colors[i]);
}
function goat(tag) {
	window.scroll({
		top: tag.offsetTop,
		left: tag.offsetLeft,
		behavior: 'smooth'
	});
}
function goat_id(id) {
	let tag = document.getElementById(id);
	goat(tag);
}
function col_exp(tag, rtt_tag) {
	taggle_state(tag);
	rtt_tag.classList.toggle("_rotation_active");
	}
	
function fit_height(tag) {
	let current_h = getComputedStyle(tag).height;
	tag.style.height = "fit-content";
	let actual_h = getComputedStyle(tag).height;
	tag.style.height = current_h;
	tag.offsetHeight;
	tag.style.height = actual_h;
}
// function continuously_fit_height(tag) {
// 	// let observer = new MutationObserver((mutations) => {

// 	// });
// 	let current_h, actual_h;
// 	current_h = tag.offsetHeight;
// 	while (true) {
// 		console.log(current_h, actual_h);
// 		// tag.style.height = "fit-content";
// 		actual_h = tag.scrollHeight;
// 		// tag.style.height = current_h;

// 		if ((actual_h > current_h) || (actual_h < current_h)) {
// 			console.log("here:", current_h, actual_h);
// 			// tag.offsetHeight;
// 			tag.style.height = actual_h;
// 			current_h = actual_h;
// 		}
// 	}
// }
function on_visibile(tag, callback) {

    let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let visibility = tag.checkVisibility({
                checkOpacity: true,
                checkVisibilityCSS: true
            });
            if ((entry.intersectionRatio > 0) && visibility){
                callback(tag);
            }
        }
    });
  }, {root: document.window});
  observer.observe(tag);
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
async function tw_print(ms, s, tag, keep_cursor=false) {
	const s_len = s.length;
	tag.innerHTML = "";

	var text = document.createElement("span");
	var cursor = document.createElement("span");
	cursor.innerHTML = "|";
	cursor.setAttribute("class", "typed-cursor typed-cursor--blink");
	
	tag.appendChild(text);
	tag.appendChild(cursor);

	for (let i = 0; i < s_len; i++) {
		await sleep(ms);
		text.innerText += s[i];
	}
	if (!keep_cursor) {
		cursor.remove();
	}
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}