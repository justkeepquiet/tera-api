"use strict";

const { i18nHandler, resultJson, validationHandler, accessFunctionHandler } = require("../middlewares/admin.middlewares");

module.exports.test = [
	i18nHandler,
	accessFunctionHandler(200),
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		resultJson(res, 0);
	}
];