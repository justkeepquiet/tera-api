"use strict";

const EventEmitter = require("events").EventEmitter;
const chronoScrollConfig = require("../../config/chronoScroll");
const сhronoScrollController = {};

Object.keys(chronoScrollConfig).forEach(itemId => {
	chronoScrollConfig[itemId].forEach(controller => {
		if (typeof controller[0] !== undefined) {
			сhronoScrollController[itemId] = (...args) => {
				const instance = new controller[0](...args);

				Object.keys(controller[1]).forEach(method => {
					if (typeof instance[method] === "function") {
						instance[method](...controller[1][method]);
					}
				});

				return instance;
			};
		}
	});
});

class ChronoScrollActions extends EventEmitter {
	constructor(serverId) {
		super();
		this.serverId = serverId;
		this.assign();
	}

	assign() {
		Object.keys(сhronoScrollController).forEach(chronoId =>
			this.on(chronoId, userId => сhronoScrollController[chronoId](userId, this.serverId))
		);
	}
}

module.exports = ChronoScrollActions;