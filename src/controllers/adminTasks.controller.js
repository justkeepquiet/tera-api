"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const moment = require("moment-timezone");

const { accessFunctionHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ queueModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { handler, tag } = req.query;

		const tasks = await queueModel.tasks.findAll({
			where: {
				...handler ? { handler } : {},
				...tag ? { tag } : {}
			},
			order: [
				["id", "DESC"]
			]
		});

		res.render("adminTasks", {
			layout: "adminLayout",
			moment,
			tag,
			handler,
			tasks
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.restartAction = ({ queue }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		await queue.start(true);

		res.redirect("/tasks");
	}
];

/**
 * @param {modules} modules
 */
module.exports.cancelFailedAction = ({ queue }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { handler, tag } = req.query;

		await queue.clear(queue.status.rejected, handler || null, tag || null);

		res.redirect("/tasks");
	}
];

/**
 * @param {modules} modules
 */
module.exports.cancelAllAction = ({ queue }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		await queue.clear();

		res.redirect("/tasks");
	}
];