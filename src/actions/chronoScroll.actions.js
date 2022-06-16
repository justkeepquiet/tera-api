"use strict";

const chronoScrollConfig = require("../../config/chronoScroll");
const сhronoScrollController = {};

Object.keys(chronoScrollConfig).forEach(itemId =>
	chronoScrollConfig[itemId].forEach(controller => {
		if (controller[0] === undefined) return;

		сhronoScrollController[itemId] = (...args) => {
			const instance = new controller[0](...args);
			const promises = [];

			Object.keys(controller[1]).forEach(method => {
				if (typeof instance[method] === "function") {
					promises.push(instance[method](...controller[1][method]));
				}
			});

			return Promise.all(promises);
		};
	})
);

class ChronoScrollActions {
	constructor(serverId, userId) {
		this.serverId = serverId;
		this.userId = userId;
	}

	execute(chronoId) {
		if (сhronoScrollController[chronoId] === undefined) {
			return Promise.reject("invalid chronoId");
		}

		return сhronoScrollController[chronoId](this.userId, this.serverId);
	}
}

module.exports = ChronoScrollActions;