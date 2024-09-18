"use strict";

class CoreLoader {
	constructor(modules = {}) {
		this.modules = modules;
		this.promises = [];
	}

	async setAsync(name, callback, ...args) {
		this.modules[name] = await callback(...args, this.modules);
	}

	setPromise(name, callback, ...args) {
		this.promises.push(callback(...args, this.modules).then(modules =>
			this.modules[name] = modules
		));
	}

	async final() {
		await Promise.all(this.promises);
		return this.modules;
	}
}

module.exports = CoreLoader;