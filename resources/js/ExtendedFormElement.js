class ExtendedFormElement extends HTMLFormElement {
	//	Support for PATCH, PUT, DELETE request.
	//
	//	If the form method is GET or POST, the page is reloaded; Otherwise a Response interface of the
	//	Fetch API is returned
	//
	//	should be handled this way:
	//	```
	//	let form = {{ form tag with the "is" attribute set to "x-form" }};
	//	let response = form.submit();
	//	```
	
	constructor() {
		super();
		this.addEventListener('submit', this._x_submit);
	}
  
	async _x_submit(event) {
		event.preventDefault();
		if (
			this.getAttribute("method").match(/patch/i)			// this.method returns either GET or POST
			|| this.getAttribute("method").match(/put/i)		// even if the method attribute is set to
			|| this.getAttribute("method").match(/delete/i)		// something else
		) {
			return await fetch(this.action, {
				headers: {'X-CSRFToken': getCookie("csrftoken")},		// csrftoken. for getCookie, see
				method: this.getAttribute("method").toUpperCase(),		// https://docs.djangoproject.com/en/4.0/ref/csrf/#ajax
				body: new FormData(this),
				redirect: "follow",										// get redirected if error occurred
			});
		} else {
			this.submit();
		}
	}
}

customElements.define("x-form", ExtendedFormElement, { extends: "form" });
