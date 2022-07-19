"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const { resultJson } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.notifications = ({ logger, queue }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		if (!req.isAuthenticated()) {
			return resultJson(res, 3, { msg: "access denied" });
		}

		queue.findByStatus(queue.status.rejected, 6).then(tasks => {
			const items = [];

			if (req.user.type !== "steer" || Object.values(req.user.functions).includes("/tasks")) {
				tasks.forEach(task => {
					items.push({
						class: "text-danger",
						icon: "fa-warning",
						message: `(${task.get("handler")}) ${task.get("message")}`
					});
				});
			}

			resultJson(res, 0, { msg: "success", count: items.length, items });
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];