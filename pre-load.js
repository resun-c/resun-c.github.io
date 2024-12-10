const ROOT = document.querySelector(':root');
const ROOT_COMPUTED_STYLE = getComputedStyle(ROOT);

window.addEventListener("load", () => {
	ROOT.style.setProperty("--window_h", `${window.innerHeight}px`);
});

window.is_element = function(o) {
	return (
		typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
	);
}

window.sleep = function (ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

window.rgba_to_hex = (rgba) => {
	return window.rgb_to_hex(rgba);
}

window.rgb_to_hex = (rgb, opacity) => {
	rgb = rgb.replace("rgb(", "").replace(")", "").replace("rgba(", "");
	
	let splitted_rgb = rgb.split(",");
	
	let r = Math.trunc(parseInt(splitted_rgb[0])).toString(16);
	let g = Math.trunc(parseInt(splitted_rgb[1])).toString(16);
	let b = Math.trunc(parseInt(splitted_rgb[2])).toString(16);
	
	let a = null;
	if (splitted_rgb.length == 4) {
		a = Math.trunc(parseInt(splitted_rgb[3]) * 100).toString(16);
	} else if (opacity && opacity < 1) {
		a = Math.trunc(opacity * 100).toString(16);
	}
	
	if (r.length < 2)
		r = '0' + r;
	if (g.length < 2)
		g = '0' + g;
	if (b.length < 2)
		b = '0' + b;
	return `#${r}${g}${b}${a ? a : ''}`;
}

window.valid_hex_colour = (__value) => {
	return /^#[0-9A-F]{6}$/i.test(__value);
}

window.goat = (tag) => {
	window.scroll({
		top: tag.offsetTop,
		left: tag.offsetLeft,
		behavior: 'smooth'
	});
}
window.goat_id = (id) => {
	let tag = document.getElementById(id);
	goat(tag);
}

// messing up Date
Date.prototype.monthNames = [
	"Jan", "Febr", "Mar",
	"Apr", "May", "Jun",
	"Jul", "Aug", "Sep",
	"Oct", "Nov", "Dec"
];
	
Date.prototype.getMonthMMM = function () {
	return this.monthNames[this.getMonth()];
}

// source https://docs.djangoproject.com/en/4.0/ref/csrf/
document.get_cookie = function (name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		let cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i].trim();
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function set_h_scroller(tag) {
	tag.addEventListener("wheel", function (event) {
		event.preventDefault();
		this.scrollLeft += event.deltaY;
	});
}

function set_fit_height(tag) {
	let current_h = tag.style.height;
	tag.style.height = "fit-content";
	let actual_h = getComputedStyle(tag).height;
	tag.style.height = current_h;
	tag.style.setProperty("--fit-height", actual_h);
	tag.removeAttribute("get-fit-height");
}
	
function set_all_fit_height(tag) {
	tag.querySelectorAll("[get-fit-height]").forEach((get_fit_height) => {
		set_fit_height(get_fit_height);
	});
}

function fit_height(tag) {
	let current_h = getComputedStyle(tag).height;
	tag.style.height = "fit-content";
	let actual_h = getComputedStyle(tag).height;
	tag.style.height = current_h;
	tag.offsetHeight;
	tag.style.height = actual_h;
}

function fit_width(tag) {
	let current_w = getComputedStyle(tag).width;
	tag.style.width = "fit-content";
	let actual_w = getComputedStyle(tag).width;
	tag.style.width = current_w;
	tag.offsetWidth;
	tag.style.width = actual_w;
}

function get_fit_height_callback(mutations) {
	for (let mutation of mutations) {
		if (mutation.type === "attributes" && mutation.attributeName === "get-fit-height") {
			set_fit_height(mutation.target);
		} else if (mutation.type === "childList") {
			for (let added_node of mutation.addedNodes) {
				if (added_node && window.is_element(added_node)) {
					set_all_fit_height(added_node);
				}
			}
		}
	}
}

function body_custom_stylings(mutations) {
	for (let mutation of mutations) {
		if (mutation.type === "attributes") {
			switch(mutation.attributeName) {
				case "get-fit-height":
					set_fit_height(mutation.target);
					break;
				case "hscroll":
					set_h_scroller(mutation.target);
					break;
				default:
					break;
			}
		} else if (mutation.type === "childList") {
			for (let added_node of mutation.addedNodes) {
				if (added_node && window.is_element(added_node)) {
					set_all_fit_height(added_node);
				}
			}
		}
	}
}

function colexp(trigger, target, rotate_target) {
	// if target is not ._expandable_container find the first child with ._expandable_container
	if (!target.classList.contains("_expandable_container"))
		target = target.querySelector("._expandable_container");
		
	if (target.classList.contains("_expanded")) {
		target.style.height = 0;
		target.classList.remove("_expanded");
	} else {
		fit_height(target);
		target.classList.add("_expanded");
		
		document.addEventListener("click", (event2) => {
			if (target.classList.contains("_expanded")
				&& (event2.target != target || !target.contains(event2.target))
				&& (event2.target != trigger || !trigger.contains(event2.target))
			) {
				target.style.height = 0;
				target.classList.remove("_expanded");
			}
		}, {
			capture: true,
			once: true
		});
	}
	if (rotate_target){
		rotate_target.classList.toggle("_rotated");
	}
}

function static_colexp(trigger, target) {
	if (target.classList.contains("_expanded")) {
		target.classList.remove("_expanded");
		trigger.classList.remove("_expanded");
	} else {
		target.classList.add("_expanded");
		trigger.classList.add("_expanded");
	}
}

async function tw_print(ms, s, tag, keep_cursor = false) {
	let tag_isElement = await window.is_element(tag);
	if (!tag_isElement) {
		tag = document.getElementById(tag);
	}
	const s_len = s.length;
	tag.innerHTML = "";

	var text = document.createElement("span");
	var cursor = document.createElement("span");
	cursor.innerHTML = "|";
	cursor.setAttribute("class", "typed-cursor typed-cursor--blink");

	tag.appendChild(text);
	tag.appendChild(cursor);

	for (let i = 0; i < s_len; i++) {
		await window.sleep(ms);
		text.innerText += s[i];
	}
	if (!keep_cursor) {
		cursor.remove();
	}
}

function carousel(carousel_container, direction) {
	carousel_container = IrrElement.sinit(carousel_container);
	let carousel_images_container = carousel_container.query(".carousel_images_container");
	
	let all_images = carousel_images_container.query_all(".carousel_image_container");
	
	let active_image = carousel_images_container.query(".carousel_image_container.active");
	let active_image_index = -2;											// -2 + 1 = -1 !>= 0
	
	console.log(all_images);
	
	for (let i = 0; i < all_images.length; i++) {
		if (all_images[i].__eq__(active_image)) {
			active_image_index = i;
		}
	}
	
	console.log(active_image_index);
	
	let next_active_image_index = active_image_index + direction;
	
	if (next_active_image_index >= 0 && next_active_image_index < all_images.length) {
		for (let i = 0; i < all_images.length; i++) {
			all_images[i].class.remove("active");
		}
		all_images[next_active_image_index].class.add("active");
	}
}