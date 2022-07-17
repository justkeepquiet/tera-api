"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const body = require("express-validator").body;
const Op = require("sequelize").Op;

const { validationHandler, resultJson } = require("../middlewares/arbiterAuth.middlewares");

/**
 * endpoint: /systemApi/RequestAPIServerStatusAvailable
 * @param {modules} modules
 */
module.exports.RequestAPIServerStatusAvailable = ({ logger, serverModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		serverModel.info.update({ isAvailable: 0, usersOnline: 0 }, {
			where: { isEnabled: 1 }
		}).then(() =>
			res.json({ Return: true })
		).catch(err => {
			logger.error(err);
			res.json({ Return: false });
		});
	}
];

/**
 * endpoint: /authApi/RequestAuthkey
 * @param {modules} modules
 */
module.exports.RequestAuthkey = ({ logger, accountModel }) => [
	[body("clientIP").notEmpty(), body("userNo").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { clientIP, userNo } = req.body;

		accountModel.info.findOne({ where: { accountDBID: userNo } }).then(account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			resultJson(res, 0, "success", {
				Tokken: account.get("authKey")
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];

/**
 * endpoint: /authApi/GameAuthenticationLogin
 * @param {modules} modules
 */
module.exports.GameAuthenticationLogin = ({ logger, sequelize, accountModel }) => [
	[body("authKey").notEmpty(), body("userNo").isNumeric()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { authKey, clientIP, userNo } = req.body;

		accountModel.info.belongsTo(accountModel.bans, { foreignKey: "accountDBID" });
		accountModel.info.hasOne(accountModel.bans, { foreignKey: "accountDBID" });

		accountModel.info.findOne({
			where: { accountDBID: userNo },
			include: [{
				model: accountModel.bans,
				where: {
					active: 1,
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				},
				required: false,
				attributes: []
			}],
			attributes: {
				include: [
					[sequelize.col("startTime"), "banned"]
				]
			}
		}).then(account =>
			accountModel.bans.findOne({
				where: {
					active: 1,
					ip: { [Op.like]: `%"${clientIP}"%` },
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				}
			}).then(bannedByIp => {
				if (account === null) {
					return resultJson(res, 50000, "account not exist");
				}

				if (account.get("banned") || bannedByIp !== null) {
					return resultJson(res, 50010, "account banned");
				}

				if (account.get("authKey") !== authKey) {
					return resultJson(res, 50011, "authkey mismatch");
				}

				resultJson(res, 0, "success");
			})
		).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];