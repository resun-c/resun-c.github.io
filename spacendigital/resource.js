const HTTP_STATUS_TEXT = {
	'200': 'OK',
	'201': 'Created',
	'202': 'Accepted',
	'203': 'Non-Authoritative Information',
	'204': 'No Content',
	'205': 'Reset Content',
	'206': 'Partial Content',
	'300': 'Multiple Choices',
	'301': 'Moved Permanently',
	'302': 'Found',
	'303': 'See Other',
	'304': 'Not Modified',
	'305': 'Use Proxy',
	'306': 'Unused',
	'307': 'Temporary Redirect',
	'400': 'Bad Request',
	'401': 'Unauthorized',
	'402': 'Payment Required',
	'403': 'Forbidden',
	'404': 'Not Found',
	'405': 'Method Not Allowed',
	'406': 'Not Acceptable',
	'407': 'Proxy Authentication Required',
	'408': 'Request Timeout',
	'409': 'Conflict',
	'410': 'Gone',
	'411': 'Length Required',
	'412': 'Precondition Required',
	'413': 'Request Entry Too Large',
	'414': 'Request-URI Too Long',
	'415': 'Unsupported Media Type',
	'416': 'Requested Range Not Satisfiable',
	'417': 'Expectation Failed',
	'418': 'I\'m a teapot',
	'429': 'Too Many Requests',
	'500': 'Internal Server Error',
	'501': 'Not Implemented',
	'502': 'Bad Gateway',
	'503': 'Service Unavailable',
	'504': 'Gateway Timeout',
	'505': 'HTTP Version Not Supported',
};

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

window.addEventListener("scroll", function (e) {
	if (!this.oldScroll) {
		this.oldScroll = 0;
	}

	// print "false" if direction is down and "true" if up
	let bool = this.oldScroll > this.scrollY;
	this.oldScroll = this.scrollY;

	if (bool) {
		this.scrollDir = -1;
	} else {
		this.scrollDir = 1;
	}
});

const None = null, False = false, True = true;

var NOTIFICATION_CONTENT_CONTAINER, POP_UP_BUTTONS, POP_UP_CONTENT_CONTAINER, POP_UP_TITLE, POP_UP_CANCEL, POP_UP_CONTENT, POP_UP_CONTAINER;

function init() {
	NOTIFICATION_CONTENT_CONTAINER = document.getElementById("notification_content_container");
}

document.addEventListener("DOMContentLoaded", function (event) { init() });

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function hrefto(href, target = "_self") {
	window.open(href, target);
}

function goat(tag) {
	let rect = tag.getBoundingClientRect();
	let top = rect.top + window.scrollY;
	let left = rect.left + window.scrollX;

	window.scroll({
		top: top,
		left: left,
		behavior: 'smooth'
	});
}

function dict_to_form_urlencoded(dict) {
	// const formData = new FormData();
	// Object.keys(dict).forEach(key => formData.append(key, dict[key]));
	// return formData;

	let key_list = [];

	Object.keys(dict).forEach((key) => {
		key_list.push(encodeURIComponent(key) + "=" + encodeURIComponent(dict[key]));
	});
	let s = key_list.join("&");

	return s;
}

function dict_to_multipart_form_data(dict) {
	const formData = new FormData();
	Object.keys(dict).forEach(key => formData.append(key, dict[key]));
	return formData;
}

class Tag {
	static GET = "_GET_TAG";
	static GET_ALL = "_GET_TAG_ALL";
	static CREATE = "_CREATE_TAG";
	static INIT = "_INIT_TAG";
	constructor(tag = null) {
		if (tag && isElement(tag)) {
			this.init(tag)
		} else {
			return None;
		}
	}
	static get(name = "div", id = null, class_s = null, attrs = null) {
		let instance = new this();
		let query_string = "";
		instance.name = name;
		instance.id = id;
		instance.class = class_s;

		if (id) {
			instance.tag = document.getElementById(id);

			if (!instance.name) {
				instance.name = instance.tag.tagName;
			}

			instance.class = instance.tag.className;
		} else {
			query_string = "";

			if (name) {
				query_string = String(name);
			}

			if (instance.class) {
				query_string += instance.class.replaceAll(" ", ".");
			}

			instance.tag = document.querySelector(query_string);

			if (!instance.name) {
				instance.name = instance.tag.tagName;
			}
			if (!instance.is) {
				instance.id = instance.tag.id;
			}
			instance.class = instance.tag.className;
		}
		return instance;
	}
	static create(name = "div", id = null, class_s = null, contents = null, attrs = null) {
		let instance = new this();
		instance.name = name;
		instance.id = id;
		instance.class = class_s;
		instance.tag = document.createElement(name);

		if (id) instance.tag.id = id;
		if (class_s) instance.tag.setAttribute("class", instance.class);
		if ((typeof (contents) == 'number') || contents) instance.setContent(contents);
		if (attrs) {
			for (let attr in attrs) {
				instance.tag.setAttribute(attr, attrs[attr]);
			}
		}
		return instance;
	}
	static init(tag) {
		let instance = new Tag();
		instance.init(tag);
		return instance;
	}
	init(tag) {
		this.tag = tag;
		this.id = tag.id;
		this.name = tag.tagName;
		this.class = tag.className;
	}
	addContent(contents) {
		if (isElement(contents)) {
			this.tag.appendChild(contents);
		} else if (contents instanceof Array) {
			contents.forEach((single_content) => {
				this.addContent(single_content);
			})
		} else if (contents instanceof Tag) {
			this.tag.appendChild(contents.tag);
		} else if (contents instanceof Number) {
			this.tag.innerHTML += String(contents);
		} else {
			this.tag.innerHTML += contents;
		}
	}
	setContent(contents) {
		this.tag.innerHTML = "";
		this.addContent(contents);
	}
	getText() {
		return this.tag.innerText;
	}
	getHTML() {
		return this.tag.innerHTML;
	}
	textContent() {
		return this.tag.textContent;
	}
	clearContent() {
		this.tag.innerHTML = "";
	}
	setOnclick(onclick_function_name) {
		this.tag.setAttribute("onclick", onclick_function_name);
	}
	setAttr(name, value) {
		this.tag.setAttribute(name, value);
	}
	getAttr(name) {
		return this.tag.getAttribute(name);
	}
	addListener(event_name, action, useCapture = None) {
		this.tag.addEventListener(event_name, action, useCapture);
	}
	removeListener(event_name, action, capture = None) {
		this.tag.removeEventListener(event_name, action, capture);
	}
	setParent(parent) {
		parent.appendChild(this.tag);
	}
	appendChild(child) {
		this.addContent(child);
	}
	querySelector(query) {
		return this.tag.querySelector(query);
	}
	querySelectorAll(query) {
		return this.tag.querySelectorAll(query);
	}
	clone(deep = false) {
		return this.tag.cloneNode(deep);
	}
	queryTag(query) {
		let found = this.tag.querySelector(query);

		if (found) {
			let found_tag = new Tag();
			found_tag.tag = found;
			found_tag.id = found.id;
			found_tag.class = found.className;
			found_tag.name = found.tagName;

			return found_tag;
		}
		return null;
	}
	queryAllTag(query) {
		let all_found_tags = [];
		let all_found = this.tag.querySelectorAll(query);

		all_found.forEach(found => {
			let found_tag = new Tag();
			found_tag.tag = found;
			found_tag.id = found.id;
			found_tag.class = found.className;
			found_tag.name = found.tagName;

			all_found_tags.push(found_tag)
		});

		return all_found_tags;
	}
	addClass(class_name) {
		if (class_name instanceof Array && (typeof (class_name) !== "string")) {
			class_name.forEach((single_class_name) => {
				this.addClass(single_class_name);
			});
		} else if (typeof (class_name) === "string") {
			this.class += class_name;
			this.tag.classList.add(class_name);
		}
	}
	removeClass(class_name) {
		if (class_name instanceof Array && (typeof (class_name) !== "string")) {
			class_name.forEach((single_class_name) => {
				this.removeClass(single_class_name);
			});
		} else if (typeof (class_name) === "string") {
			this.class.replaceAll(class_name, "");
			this.tag.classList.remove(class_name);
		}
	}
	toggleClass(class_name) {
		this.tag.classList.toggle(class_name);
	}
	hasClass(class_name) {
		return this.tag.classList.contains(class_name);
	}
	replace(content) {
		if (isElement(content)) {
			this.tag.outerHTML = content.outerHTML;
		} else if (content instanceof Array) {
			content.forEach((single_content) => {
				this.replace(single_content);
			})
		} else if (content instanceof Tag) {
			this.tag.outerHTML = content.tag.outerHTML;
		} else {
			this.tag.outerHTML += content;
		}
	}
	getStyle(prop) {
		return this.tag.style[prop];
	}
	setStyle(prop, value) {
		return this.tag.style[prop] = value;
	}
	contains(child) {
		return this.tag.contains(child)
	}
	remove() {
		this.tag.remove();
	}
	value() {
		return this.tag.value;
	}
	setValue(value) {
		return this.tag.value = value;
	}
	toggle_height() {
		if (this.hasClass("active")) {
			this.tag.style.height = 0;
			this.removeClass("active");
		} else {
			fit_height(this.tag);
			this.addClass("active");
		}
	}
	getSize(without_padding) {
		let computed_style = getComputedStyle(this.tag);

		let height, width;

		height = parseFloat(computed_style.height);
		width = parseFloat(computed_style.width);

		if (without_padding) {

			height -= (
				parseFloat(computed_style.paddingTop) +
				parseFloat(computed_style.paddingBottom) +
				parseFloat(computed_style.borderTopWidth) +
				parseFloat(computed_style.borderBottomWidth)
			);

			width -= (
				parseFloat(computed_style.paddingLeft) +
				parseFloat(computed_style.paddingRight) +
				parseFloat(computed_style.borderLeftWidth) +
				parseFloat(computed_style.borderRightWidth)
			);
		}

		return {
			height: height,
			width: width
		}
	}

	on_visible(callback) {
		let observer = new IntersectionObserver((entries, observer) => {
			// callback(this);
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if ((entry.intersectionRatio == 1)) {
						callback(this);
					}
				}
			});
		}, { root: document.window, threshold: 1.0});
		observer.observe(this.tag);
	}
	click() {
		return this.tag.click();
	}
}

class Http_Response {
	constructor(
		success = False,
		status = 0,
		headers = None,
		content_type = None,
		body = None,
		error = None,
		error_name = None,
		error_body = None,
		message = None
	) {
		this.success = success;
		this.status = status;
		this.headers = headers;
		this.content_type = content_type;
		this.body = body;
		this.error = error;
		this.error_name = error_name;
		this.error_body = error_body;
		this.message = message;
	}
}

class Http_Request {
	static JSON = "application/json";
	static FORM_URLENCODED = "application/x-www-form-urlencoded";
	static MULTIPART_FORM = "multipart/form-data";

	constructor(url = None) {
		this.url = url;
		this.success = False;
		this.status = 0;
		this.req_headers = {};
		this.headers = {};
		this.req_content_type = None;
		this.content_type = None;
		this.body = None;
		this.error = True;
		this.error_name = None;
		this.error_body = None;
		this.csrf = None;
		this.location = None;
	}
	response() {
		try { regen_user(); } catch { }
		return new Http_Response(
			this.success,
			this.status,
			this.headers,
			this.content_type,
			this.body,
			this.error,
			this.error_name,
			this.error_body,
			this.message
		)
	}
	get(headers = None) {
		this.addReqHeaders(headers);
		try {
			let resuest_promise = new Promise((response_parser) => {
				let xhttpr = new XMLHttpRequest();
				xhttpr.onreadystatechange = () => {
					if (xhttpr.readyState == 4) {
						response_parser(xhttpr);
					}
				}
				xhttpr.open("GET", this.url, True);
				this.setReqHeader(xhttpr);
				xhttpr.send();
			});

			return resuest_promise.then((response) => {
				this.parse_response(response);
				return this.response();
			});
		} catch {
			this.error_name = "Unknown";
			this.error_body = "Some unknown error occured. Try reloading this page.";
			return this.response();
		}
	}
	post(headers = None, csrf = None, data = None, content_type = Http_Request.MULTIPART_FORM) {
		if (csrf) { this.req_headers["X-CSRFToken"] = csrf }
		if (content_type !== Http_Request.MULTIPART_FORM) {
			this.req_headers["Content-Type"] = content_type
		}
		this.addReqHeaders(headers);
		try {
			if ((content_type == Http_Request.JSON) && (typeof (data) != "string")) {
				data = JSON.stringify(data);
			}
			let resuest_promise = new Promise((response_parser) => {
				let xhttpr = new XMLHttpRequest();
				xhttpr.onreadystatechange = () => {
					if (xhttpr.readyState == 4) {
						response_parser(xhttpr);
					}
				}
				xhttpr.open("POST", this.url, True);
				this.setReqHeader(xhttpr);
				xhttpr.send(data);
			});

			return resuest_promise.then((response) => {
				this.parse_response(response);
				return this.response();
			});
		} catch {
			this.error_name = "Unknown";
			this.error_body = "Some unknown error occured. Try reloading this page.";
			return this.response();
		}
	}
	get_header_dict(response) {
		let headers = {};
		response.getAllResponseHeaders()
			.trim()
			.split(/[\r\n]+/)
			.map(value => value.split(/: /))
			.forEach(keyValue => {
				headers[keyValue[0].trim()] = keyValue[1].trim();
			});
		return headers;
	}
	parse_response(response) {
		this.status = response.status
		this.headers = this.get_header_dict(response);
		this.content_type = response.getResponseHeader("Content-type");
		this.location = response.getResponseHeader("Location");

		if (this.status >= 200 && this.status < 300) {
			this.success = True;
			this.error = False;
			this.parse_response_body(response);
		} else {
			if (this.status >= 300 && this.status < 400) {
				this.parse_response_body();
				this.redirect();
			} else if ((this.status >= 400) || (this.status >= 500)) {
				this.parse_response_body(response);
				this.show_error();
				if (this.location) {
					this.redirect();
				}
			}
		}
	}
	parse_response_body(response) {
		if (this.content_type.indexOf("json") >= 0) {
			this.body = JSON.parse(response.responseText);
			if ("redirect" in this.body) {
				this.location = this.body["redirect"];
			}
			if ("error" in this.body) {
				this.error_name = this.body["error"];
				this.error_body = `Status: ${this.status}. Error: ${this.body}.`;
			}
			if ("message" in this.body) {
				this.message = this.body["message"];
			}
		} else if (this.content_type.indexOf("text") >= 0) {
			this.body = response.responseText;
		}
	}
	async redirect() {
		let message_title = this.error;
		let message_body = this.message;
		new PopUp(message_title, message_body);
		await sleep(1000);
		window.location.href = this.location;
	}
	addReqHeaders(headers) {
		if (headers) {
			for (let key in headers) {
				this.req_headers[key] = headers[key];
			}
		}
	}
	setReqHeader(req) {
		if (this.req_headers) {
			for (let key in this.req_headers) {
				req.setRequestHeader(key, this.req_headers[key]);
			}
		}
	}
	show_error() {
		let status = "Status " + this.response_status + " " + HTTP_STATUS_TEXT[this.response_status] + ". ";
		let error = "Error " + this.error + ". ";

		let message = this.message + ". ";

		let error_text = status + error + message;

		show_ntf(error_text);
	}
}

var POPUP = null;
var POPUP_COUNT_LIMIT = 2;
var NEXT_POPUP_ZINDEX = 8;

var POP_UP_CANCEL_BUTTON = null;

class PopUp {
	static POPUP_YESNO = "__pop_up_yesno__";
	static POPUP_YESNO_TRUE = "__pop_up_yesno_true__";
	static POPUP_YESNO_FALSE = "__pop_up_yesno_false__";
	static POPUP_NORMAL = "__pop_up_normal__";
	static POPUP_WIDE = "__pop_up_wide__";
	static POPUP_SHORT = "__pop_up_short__";
	static POPUP_SENSITIVE = "__pop_up_sensitive__";
	static POPUP_CLOSED = "__pop_up_closed__";
	constructor(title = null, content = null, types = [PopUp.POPUP_NORMAL], attrs = {}, callback = null) {
		if (POPUP_COUNT_LIMIT-- < 0) {
			show_ntf("please Close the existing pop_up!");
			return null;
		}

		this.title = title;
		this.content = content;
		this.types = types;
		this.attrs = attrs;
		this.buttons = [];
		this.changes = [];
		this.callback = callback !== null ? callback : this.rand_callback;
		this.WIDE = False;
		this.SHORT = False;
		this.NORMAL = False;
		this.YESNO = False;
		this.SENSITIVE = False;
		NEXT_POPUP_ZINDEX += 5;

		this.CONTAINER = Tag.create("div", "pop_up_container",
			"pop_up_container _center_items_h _center_items_v _fill_h",

		);

		this.CONTENT_CONTAINER = Tag.create("div", "pop_up_content_container",
			"pop_up_content_container _flex_column _center_h _center_v",

		);

		this.HEADER = Tag.create("div", null,
			"pop_up_header _flex_row _center_items_v",
		);

		this.TITLE_CONTAINER = Tag.create("div", "pop_up_titile_container",
			"pop_up_titile_container _left _fit_h _fill_w _center_items_h",
		);

		this.TITLE = Tag.create("div", "pop_up_titile",
			"pop_up_titile _fit_w _no_margin _centered_text",
			this.title ? this.title : ""
		);

		this.TITLE_CONTAINER.setContent(this.TITLE);

		this.CANCEL = Tag.create("p", "pop_up_cancel",
			"pop_up_cancel _no_margin _icon_button _right _fit_h _fit_w",
			`<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
				<path
					d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
			</svg>`
		);

		this.HEADER.setContent([this.TITLE_CONTAINER, this.CANCEL]);

		this.BODY = Tag.create("div", null,
			"pop_up_body",
		);

		this.CONTENT = Tag.create("div", "pop_up_content",
			"pop_up_content _flex_column _fill_h _center_items_h",
		);

		this.BUTTONS = Tag.create("div", "pop_up_buttons",
			"pop_up_buttons _center_items_v _space_evenly_items_h",
		);

		this.BODY.setContent([this.CONTENT, this.BUTTONS]);

		this.CONTENT_CONTAINER.setContent([this.HEADER, this.BODY])

		this.CONTAINER.setContent(this.CONTENT_CONTAINER);

		document.body.appendChild(this.CONTAINER.tag);

		// cancel event listener
		this.CANCEL.addListener("click", () => { this.close() });



		this.types.forEach((type) => {
			switch (type) {
				case PopUp.POPUP_WIDE:
					this.CONTENT_CONTAINER.addClass("wide");
					this.WIDE = True;
					break;
				case PopUp.POPUP_SHORT:
					this.CONTENT_CONTAINER.addClass("short");
					this.SHORT = True;
					break;
				case PopUp.POPUP_NORMAL:
					this.CONTENT_CONTAINER.removeClass("wide");
					this.CONTENT_CONTAINER.removeClass("short");
					this.NORMAL = True;
					break;
				case PopUp.POPUP_YESNO:
					this.add_yes_no();
					this.YESNO = True;
					this.CONTENT_CONTAINER.addClass("short");
					this.SHORT = True;
					break;
				case PopUp.POPUP_SENSITIVE:
					this.SENSITIVE = true;
					this.CONTAINER.addListener("click", (event) => {
						if (event.target == this.CONTAINER.tag) {
							this.close();
						}
					})
			}
		});

		this.represent();
	}
	rand_callback(event) {
		return event;
	}
	setTitle(title) {
		if (title) {
			this.title = isElement(title) ? title.outerHTML : title;
		}
		this.refresh();
	}
	appendTag(tag) {
		this.CONTENT.addContent(tag);
	}
	setContent(content) {
		this.CONTENT.clearContent();
		this.addContent(content);
	}
	addContent(content) {
		this.CONTENT.addContent(content);
		this.content = this.CONTENT.getHTML();
	}
	setButton(button) {
		this.buttons = [];
		this.addButton(button);
		this.refresh();
	}
	addButton(button) {

		this.BUTTONS.addContent(button);
		this.buttons = [...this.BUTTONS.tag.children];
	}
	removeButton(button_id) {
		this.buttons.forEach((button) => {
			if (button.id == button_id) {
				let index = this.buttons.indexOf(button);
				if (index >= 0) {
					this.buttons.splice(index, 1)
				}
			}
		});
		this.refresh();
	}
	async close() {
		this.CONTENT_CONTAINER.removeClass("active");
		this.BUTTONS.setContent("");
		this.CONTENT.setContent("");

		if (!this.SHORT) {
			await sleep(300);
		}

		this.CONTAINER.removeClass("active");

		this.CONTAINER.remove();
		this.callback(PopUp.POPUP_CLOSED);
		POPUP_COUNT_LIMIT++;
	}
	add_yes_no() {
		// let yes_no = Tag.create("div", null,
		// 	"flex_row _space_between_items _center_h _center_v"
		// );
		let yes = Tag.create("span", null, "_button", "Yes");
		let no = Tag.create("span", null, "_button", "No");

		yes.addListener("click", () => {
			this.callback(PopUp.POPUP_YESNO_TRUE);
			this.close();
		});
		no.addListener("click", () => {
			this.callback(PopUp.POPUP_YESNO_FALSE);
			this.close();
		});

		this.setButton([yes, no]);
	}
	generate() {
		// clear the buttons
		this.BUTTONS.setContent("");

		// represent the content
		this.TITLE.setContent(this.title);
		this.CONTENT.setContent(this.content);
		this.buttons.forEach((button) => {
			this.BUTTONS.addContent(button);
		});
	}
	refresh() {
		this.generate();
	}
	async represent() {
		this.CONTAINER.addClass("active");
		this.CONTENT_CONTAINER.addClass("active");
		if (this.buttons.length > 0) {
			this.BUTTONS.addClass("active");
		}
		this.refresh();
	}
	refreshed() {
		this.generate();
	}
}

async function show_ntf(s) {
	let notification = document.createElement("div");
	let notification_remove = document.createElement("p");
	let notification_content = document.createElement("p");

	notification.setAttribute("class", "notification _flex_row _right _center_items_v");
	notification_remove.setAttribute("class", "notification_remove _force_right _cursor_pointer _center_items_v _no_select _fit");
	notification_remove.setAttribute("onclick", "hide_ntf(this.parentElement)");

	notification_content.setAttribute("class", "notification_content _left _no_margin");

	notification_remove.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" viewBox=\"0 96 960 960\" width=\"48\"><path d=\"m330 768 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42Zm150 208q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z\" /></svg>";
	notification_content.innerHTML = s;

	notification.appendChild(notification_content);
	notification.appendChild(notification_remove);

	NOTIFICATION_CONTENT_CONTAINER.appendChild(notification);

	await sleep(50);

	notification.classList.add("active");

	await sleep(5000);

	hide_ntf(notification);
}

async function hide_ntf(notification) {
	notification.classList.remove("active");
	await sleep(400);
	notification.remove();
}

function col_exp_class(tag, rtt_tag = null) {
	if (isElement(tag)) {
		tag = new Tag(tag);
	}
	if (isElement(rtt_tag)) {
		rtt_tag = new Tag(rtt_tag);
	}
	try {
		if (tag) {
			tag.toggleClass("active");
		}
		if (rtt_tag) {
			rtt_tag.toggleClass("_rotation_active");
		}
	} catch {
		;
	}
}

function col_exp(tag, rtt_tag = null) {
	if (isElement(tag)) {
		tag = new Tag(tag);
	}
	if (isElement(rtt_tag)) {
		rtt_tag = new Tag(rtt_tag);
	}
	try {
		toggle_height(tag.tag);
		if (rtt_tag) {
			rtt_tag.toggleClass("_rotation_active");
		}
	} catch {
		;
	}
}

function get_size_style(tag) {
	if (!isElement(tag) && !(tag instanceof Tag)) return None;

	if (!(tag instanceof Tag)) tag = new Tag(tag);

	let data = {
		height: tag.getStyle("height"),
		width: tag.getStyle("width")
	}
	return data;
}

function set_size_style(tag, data) {
	if (!isElement(tag) && !(tag instanceof Tag)) return None;

	if (!(tag instanceof Tag)) tag = new Tag(tag);

	tag.setStyle("height", data.height);
	tag.setStyle("width", data.width);
}

function freeze_size(tag) {
	if (!isElement(tag) || !(tag instanceof Tag)) return None;

	if (!(tag instanceof Tag)) tag = new Tag(tag);

	let height = getComputedStyle(tag.tag).height;
	let width = getComputedStyle(tag.tag).width;

	tag.setStyle("height", height);
	tag.setStyle("width", width);
}

function fit_height(tag) {
	var current_h = getComputedStyle(tag).height;
	tag.style.height = "fit-content";
	var actual_h = getComputedStyle(tag).height;
	tag.style.height = current_h;
	tag.offsetHeight;
	tag.style.height = actual_h;
}

function toggle_height(tag) {
	if ((typeof (tag) == "string")) {
		tag = document.querySelector(tag);
	}

	if (tag.classList.contains("active")) {
		tag.style.height = 0;
		tag.classList.remove("active");
	} else {
		fit_height(tag);
		tag.classList.add("active");
	}
}

function is_url(string) {
	try {
		new URL(string);
		return true;
	} catch (err) {
		return false;
	}
}

// create a loading animation inside the tag
function create_loading_animation(tag = null, types = ["bar"], count = 1) {
	let
		container,
		CIRCLE = False,
		BAR = False,
		WIPE_CONTENT = False,
		SMALL = False;

	types.forEach((type) => {
		switch (type) {
			case "bar": BAR = True; break;
			case "circle": CIRCLE = True; break;
			case "wipe_content": WIPE_CONTENT = True; break;
			case "small": SMALL = True; break;
			default: break;
		}
	});

	if (isElement(tag)) {
		tag = new Tag(tag);
	}

	if (BAR) {
		container = Tag.create("div", "loading_animation",
			`loading_animation bar ${SMALL ? "small" : ""} _flex_row _center_h _fill_w`
		);
	} else if (CIRCLE) {
		container = Tag.create("div", "loading_animation",
			`loading_animation_circle ${SMALL ? "small" : ""} _center`
		);

		if (tag) {
			let size = tag.getSize(true);

			let container_size = Math.min(size.height, size.width);

			container.setStyle("height", `${container_size}px`);
			container.setStyle("width", `${container_size}px`);

			container = Tag.create("div", null,
				`loading_animation_wrapper _force_full _center_items`,
				container
			);

			container.setStyle("height", `${size.height}px`);
			container.setStyle("width", `${size.width}px`);
		}
	}

	if (!tag) {
		return container;
	}

	if (WIPE_CONTENT) {
		tag.clearContent();
	}

	for (let c = 0; c < count - 1; c++) {
		tag.addContent(container.clone(true));
	}

	tag.addContent(container);

	return container;
}

function isElement(o) {
	return (
		typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
	);
}

function remove_loading_animation(tag, types = [], deep = false) {
	let all_loading_animations = [], all_loading_animations_wrapper = [];
	let
		container,
		CIRCLE = False,
		BAR = False,
		WIPE_CONTENT = False,
		SMALL = False;

	types.forEach((type) => {
		switch (type) {
			case "bar": BAR = True; break;
			case "circle": CIRCLE = True; break;
			case "wipe_content": WIPE_CONTENT = True; break;
			case "small": SMALL = True; break;
			default: break;
		}
	});

	query_class = "";

	if (CIRCLE) {
		query_class = ".loading_animation_circle";
	} else if (BAR) {
		query_class = ".loading_animation.bar";
	}


	if (deep) {
		all_loading_animations = tag.querySelectorAll(query_class);
		all_loading_animations_wrapper = tag.querySelectorAll(".loading_animation_wrapper");
	} else {
		all_loading_animations = [tag.querySelector(query_class)]
		all_loading_animations_wrapper = tag.querySelectorAll(".loading_animation_wrapper");
	}

	try {
		all_loading_animations.forEach((loading_animations) => {
			loading_animations.remove();
		});
	} catch { }

	try {
		all_loading_animations_wrapper.forEach((loading_animations_wrapper) => {
			loading_animations_wrapper.remove();
		});
	} catch { }
}

function download_string_as_file(filename, text) {
	let element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}

function on_visible(tag, callback) {
	let observer = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				if ((entry.intersectionRatio > 0)) {
					callback(tag);
				}
			}
		});
	}, { root: document.window });
	observer.observe(tag);
}

function utf8_to_b64(str) {
	return window.btoa(decodeURIComponent(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
	return atob(decodeURIComponent(str));
}

function parse_encoded_cookie(name) {
	let cookie = b64_to_utf8(get_cookie(name));
	// let js_text = cookie.replaceAll("\"", ""); //.replaceAll("True", "true");
	let parsed = JSON.parse(cookie);
	return parsed;
}

function get_cookie(name) {
	let cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; ++i) {
		let trimmed = cookies[i].trim();
		let key_end = trimmed.indexOf("=");
		let key = trimmed.slice(0, key_end);
		if (key == name) {
			let val = trimmed.slice((key_end + 1));
			return val;
		}
	}
	return null;
};

const abbr_num = n => {
	if (n < 1e3) return n;
	if (n >= 1e3) return +(n / 1e3).toFixed(1) + "K";
};

const truncate_str = (source, size) => {
	return source.length > size ? source.slice(0, size - 1) + "…" : source;
}

async function tw_print(ms, s, tag, keep_cursor = false) {
	if (!(tag instanceof Tag) && !isElement(tag)) {
		tag = document.getElementById(tag);
	}
	if (await isElement(tag)) tag = new Tag(tag);

	const s_len = s.length;
	tag.innerHTML = "";

	var text = document.createElement("span");
	var cursor = document.createElement("span");
	cursor.innerHTML = "|";
	cursor.setAttribute("class", "_typed_cursor _typed_cursor__blink");

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

// THIS IS A FUCKING REMINDER THAT YOU SHOULD
// CREATE YOUR OWN LANGUAGE TO GET RID OF FUCKING JS
