class IrrElement {
	invalid_repr_attr = ["id", "class"];
	constructor(name = "irr", id = null, classes = null, contents = null, attrs = null) {

		// the actual HTMLElement
		this._element = null;
		this.name = null;
		this.class = {
			add:	(...args)	=> { this.__bool__ ? args.map((x) => {this._element.classList.add(x)}) : null },
			remove:	(...args)	=> { this.__bool__ ? args.map((x) => {this._element.classList.remove(x)}) : null },
			set:	(arg)		=> { this.__bool__ ? this._element.className = arg : null },
			get:	()			=> { return this.__bool__ ? this._element.className : null },
			toggle:	(arg)		=> { this.__bool__ ? this._element.classList.toggle(arg) : null },
			has:	(arg)		=> { return this.__bool__ ? this._element.classList.contains(arg) : null }
		};
		this.attr = {
			get:	(arg)		=> { return this.__bool__ ? this._element.getAttribute(arg) : null },
			set:	(arg, val)	=> { this.__bool__ ? this._element.setAttribute(arg, val) : null },
			remove:	(arg)		=> { this.__bool__ ? this._element.removeAttribute(arg) : null },
			has:	(arg)		=> { return this.__bool__ ? this._element.hasAttribute(arg) : null }
		}
		this.style = {
			get:	(arg)		=> { return this.__bool__ ? this._element.style[arg] : null },
			set:	(arg, val)	=> { this.__bool__ ? this._element.style.setProperty(arg, val) : null },
			remove:	(arg)		=> { this.__bool__ ? this._element.style.removeProperty(arg) : null; },
		}
		
		if (name) {
			this._element = document.createElement(name);
			this.name = name;
			IrrElement.update(this, id, classes, contents, attrs);
		}
	}
	
	get __bool__ () {
		// returns wheather or not the object is usable
		return this._element ? true : false;
	}
	
	get __repr__ () {
		if (!this.__bool__) return {};
		
		let d = {
			name: this.name,
			id: this.id,
			classes: this.class.get(),
			contents: null,
			attrs: {}
		}
		
		if (this._element.children.length > 0) {
			d.contents = [];
			for (let i = 0; i < this._element.children.length; i++) {
				d.contents.push(IrrElement.sinit(this._element.children[i]).__repr__)
			}
		} else {
			if (/style/i.test(this.name)) {
				d.contents = this.text.replace(" \n\t", " ");
			} else {
				d.contents = this.text;
			}
		}
		
		if (this._element.attributes.length > 0) {
			for (let i = 0; i < this._element.attributes.length; i++) {
				if (!this.invalid_repr_attr.includes(this._element.attributes[i].nodeName)) {
					d.attrs[this._element.attributes[i].nodeName] = this._element.attributes[i].nodeValue;
				}
			}
		}
		
		return d;
	}
	
	static sinit(element) {
		let instance = new IrrElement();
		instance.init(element);
		return instance;
	}
	
	init(element) {
		this._element = element;
		this.name = element.tagName;
	}
	
	static get(name = null, id = null, classes = null, attrs = null) {
		let instance = new IrrElement();
		instance.name = name;

		if (id) {
			instance._element = document.getElementById(id);
			
			if (!instance._element) {
				console.log("No Element with id: ", id);
				return null;
			}

			if (!instance.name) {
				instance.name = instance._element.tagName;
			}
		} else {
			let query_string = "";

			if (name) {
				query_string = String(name);
			}

			if (classes) {
				query_string += "." + classes.replaceAll(" ", ".");
			}

			instance._element = document.querySelector(query_string);

			if (instance._element) {
				if (!instance.name) {
					instance.name = instance._element.tagName;
				}
			}
		}
		return instance;
	}
	
	static update(irr_element, id = null, classes = null, contents = null, attrs = null) {
		if (irr_element) {
			if (id) irr_element._element.id = id;
			
			if (classes && classes instanceof Array && typeof classes !== "string") {
				classes = classes.join(" ");
			}
			
			if (classes) {
				irr_element._element.className = classes;
			}
			
			if (contents) { irr_element.clear(); irr_element.add(contents) }
			if (attrs) {
				for (let attr in attrs) {
					irr_element._element.setAttribute(attr, attrs[attr]);
				}
			}
		}
	}
	
	/* HTMLElement */
	get element() { return this._element }
	
	get id() { return this._element.id };
	
	/* inner */
	get content() { return this.__bool__ ? this._element.textContent  : null }
	set content(__value) { this.clear(); this.add(__value) }
	
	get text() { return this.__bool__ ? this._element.innerText : null }
	set text(__value) { this.__bool__ ? this._element.innerText = __value: null }
	
	/* inner */
	get ihtml() { return this.__bool__ ? this._element.innerHTML : null }
	set ihtml(__value) { this.__bool__ ? this._element.innerHTML = __value : null }
	
	/* outter */
	get ohtml() { return this.__bool__ ? this._element.outerHTML : null }
	set ohtml(__value) { this.__bool__ ? this._element.outerHTML = __value : null }
	
	get parent() {return IrrElement.sinit(this._element.parentElement) }
	
	get previous() { return IrrElement.sinit(this._element.previousElementSibling) }
	get next() { return IrrElement.sinit(this._element.nextElementSibling) }
	
	get value() { return this._element.value }
	set value(__value) { this.__bool__ ? this._element.value = __value: null; }

	/* tells if o is an HTMLElement */
	is_element(o) {
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
				o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
		);
	}
	
	is_repr(o) {
		return (
			typeof o === "object" && "name" in o && "classes" in o && "contents" in o
		);
	}
	
	/* adds contents inside this element */
	add(contents) {
		if (!contents || !this.__bool__) return;		// no content
		
		if (this.is_element(contents)) {
			this._element.appendChild(contents);
		} else if (this.is_repr(contents)) {
			let t = new IrrElement(contents.name, contents.id, contents.classes, contents.contents, contents.attrs);
			if (t.__bool__) {		// only append if it's an element
				this._element.appendChild(t._element);
			}
		} else if (contents instanceof Array) {
			contents.forEach((single_content) => {
				this.add(single_content);
			});
		} else if (contents instanceof IrrElement) {
			this._element.appendChild(contents._element);
		} else if (contents instanceof Number) {
			this._element.innerText += String(contents);
		} else {
			this._element.innerHTML += contents;
		}
	}
	
	clear() {
		if (this.__bool__)
			this._element.innerHTML = "";
	}
	
	/* add event listener */
	ael(event_name, action, useCapture = null) {
		this._element.addEventListener(event_name, action, useCapture);
	}
	
	/* remove event listener */
	rel(event_name, action, capture = null) {
		this._element.removeEventListener(event_name, action, capture);
	}
	
	clone(deep = false) {
		return this._element.cloneNode(deep);
	}
	
	/* query a single element */
	query(query) {
		let found = this._element.querySelector(query);

		if (found) {
			let found_tag = new IrrElement();
			found_tag._element = found;
			found_tag.name = found.tagName;

			return found_tag;
		}
		return null;
	}
	
	/* query all the element */
	query_all(query) {
		let all_found_tags = [];
		let all_found = this._element.querySelectorAll(query);

		all_found.forEach(found => {
			let found_tag = new IrrElement();
			found_tag._element = found;
			found_tag.name = found.tagName;

			all_found_tags.push(found_tag)
		});

		return all_found_tags;
	}
	
	/* query all the element */
	static query_all(query) {
		let all_found_tags = [];
		let all_found = document.querySelectorAll(query);

		all_found.forEach(found => {
			let found_tag = new IrrElement();
			found_tag._element = found;
			found_tag.name = found.tagName;

			all_found_tags.push(found_tag)
		});

		return all_found_tags;
	}
	
	/* replace itself with content */
	replace(content) {
		if (this.is_element(content)) {
			this._element.outerHTML = content.outerHTML;
		} else if (content instanceof Array) {
			content.forEach((single_content) => {
				this.replace(single_content);
			})
		} else if (content instanceof IrrElement) {
			this._element.outerHTML = content._element.outerHTML;
		} else {
			this._element.outerHTML += content;
		}
	}
	
	/* check if it contains child */
	contains(child) {
		return child instanceof IrrElement ? this._element.contains(child.element) : this._element.contains(child);
	}
	
	/* remove itself from the DOM three */
	remove() {
		this._element.remove();
	}
	
	/* set onvisible event listener */
	_on_visible(callback, ratio = 0.01, threshold = 0) {
		this._iobserver = new IntersectionObserver((entries, observer) => {
			// callback(this);
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					if ((entry.intersectionRatio >= ratio)) {
						callback(this);
					}
				}
			});
		}, { root: document.window, threshold: threshold });
		this._iobserver.observe(this._element);
	}
	
	// EVENT listeners
	get onvisible() { return null }
	set onvisible(__value) { this._on_visible(__value) }
	// EVENT listeners
	get onhalfvisible() { return null }
	set onhalfvisible(__value) { this._on_visible(__value, 0.5, 0.1) }
	// EVENT listeners
	get ononethirdvisible() { return null }
	set ononethirdvisible(__value) { this._on_visible(__value, 0.3, 0.1) }
	// EVENT listeners
	get ononetenthvisible() { return null }
	set ononetenthvisible(__value) { this._on_visible(__value, 0.1, 0.1) }
	// EVENT listeners
	get onfullvisible() { return null }
	set onfullvisible(__value) { this._on_visible(__value, 1.0, 0.1) }
	
	get onclick() { return null }
	set onclick(__value) { this._element.onclick = __value; }
}