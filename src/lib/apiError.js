"use strict";

class ApiError extends Error {
	constructor(message, code) {
		super(message);

		this.name = this.constructor.name;
		this.code = code;
	}

	resultCode() {
		return this.code;
	}
}

module.exports = ApiError;