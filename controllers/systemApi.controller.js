"use strict";

const accountModel = require("../models/account.model");

class SystemApiController {
	/**
	 * @type {import("express").RequestHandler}
	 */
	static requestAPIServerStatusAvailable(req, res) {
		accountModel.sequelize.authenticate().then(() =>
			res.json({
				"Return": true
			})
		).catch(() =>
			res.json({
				"Return": false
			})
		);
	}
}

module.exports = SystemApiController;