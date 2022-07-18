"use strict";

class CoreLoader {
	constructor() {
		this.promises = [];
		this.resolved = {};
	}

	setAsync(name, callback, ...args) {
		this.resolved[name] = callback(...args, this.resolved);
	}

	setPromise(name, callback, ...args) {
		this.promises.push(callback(...args, this.resolved).then(resolved =>
			this.resolved[name] = resolved
		));
	}

	final() {
		return Promise.all(this.promises).then(() =>
			Promise.resolve(this.resolved)
		);
	}
}

module.exports = CoreLoader;