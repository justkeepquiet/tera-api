"use strict";

class FcgiError extends Error {
	constructor(message, code) {
		super(message);

		this.name = this.constructor.name;
		this.code = code;
	}

	resultCode() {
		return this.code;
	}
}

module.exports = FcgiError;