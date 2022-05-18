"use strict";

const path = require("path");
const crypto = require("crypto");
const uuid = require("uuid");
const i18n = require("i18n");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const body = require("express-validator").body;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");
const { locale } = require("moment-timezone");

i18n.configure({
	directory: path.resolve(__dirname, "../locales/launcher"),
	defaultLocale: process.env.API_PORTAL_LOCALE
});

/**
 * @param {import("express").Response} res
 */
const result = (res, code, message, params = {}) => res.json({
	Return: code === 0, ReturnCode: code, Msg: message, ...params
});

/**
 * @type {import("express").RequestHandler}
 */
const validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return result(res, 2, "invalid parameter");
	}

	next();
};

/**
 * @type {import("express").RequestHandler}
 */
const i18nHandler = (req, res, next) => {
	res.locals.__ = i18n.__;
	return next();
};

module.exports = {
	MainHtml: [
		i18nHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const regions = {};

			Object.keys(process.env).forEach(key => {
				const found = key.match(/API_PORTAL_CLIENT_REGIONS_([A-Z]+)$/);

				if (found) {
					regions[found[1]] = process.env[key];
				}
			});

			res.render("launcherMain", {
				locale: i18n.getLocale(),
				patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
				region: process.env.API_PORTAL_CLIENT_DEFAULT_REGION,
				regions
			});
		}
	],

	LoginFormHtml: [
		i18nHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			res.render("launcherLoginForm", {
				locale: i18n.getLocale(),
				qaPrivilege: process.env.API_PORTAL_LAUNCHER_QA_PRIVILEGE
			});
		}
	],

	RegisterFormHtml: [
		i18nHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			res.render("launcherRegisterForm", {
				locale: i18n.getLocale()
			});
		}
	],

	MaintenanceStatus: [
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			accountModel.maintenance.findOne({
				where: {
					startTime: { [Op.lt]: accountModel.sequelize.fn("NOW") },
					endTime: { [Op.gt]: accountModel.sequelize.fn("NOW") }
				}
			}).then(maintenance => {
				if (maintenance !== null) {
					result(res, 0, "success", {
						StartTime: moment(maintenance.get("startTime")).unix(),
						EndTime: moment(maintenance.get("startTime")).unix(),
						Description: maintenance.get("description")
					});
				} else {
					result(res, 0, "success");
				}
			}).catch(err => {
				logger.error(err.toString());
				result(res, 1, "database error");
			});
		}
	],

	LoginAction: [
		[body("login").notEmpty(), body("password").notEmpty()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { login, password } = req.body;

			accountModel.info.findOne({ where: { userName: login } }).then(account => {
				let passwordString = password;

				if (/^true$/i.test(process.env.API_USE_SHA512_PASSWORDS)) {
					passwordString = crypto.createHash("sha512").update(process.env.API_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
				}

				if (account === null || account.get("passWord") !== passwordString) {
					logger.warn("Invalid login or password");
					return result(res, 50015, "password error");
				}

				const authKey = uuid.v4();

				accountModel.info.update({ authKey: authKey }, {
					where: { accountDBID: account.get("accountDBID") }
				}).then(async () => {
					let characterCount = "0";

					try {
						const characters = await accountModel.characters.findAll({
							attributes: ["serverId", [accountModel.characters.sequelize.fn("COUNT", "characterId"), "charCount"]],
							group: ["serverId"],
							where: { accountDBID: account.get("accountDBID") }
						});

						if (characters !== null) {
							characterCount = helpers.getCharCountString(characters, "serverId", "charCount");
						}
					} catch (err) {
						logger.error(err.toString());
					}

					result(res, 0, "success", {
						CharacterCount: characterCount,
						Permission: account.get("permission"),
						Privilege: account.get("privilege"),
						UserNo: account.get("accountDBID"),
						UserName: account.get("userName"),
						AuthKey: authKey
					});
				}).catch(err => {
					logger.error(err.toString());
					result(res, 50811, "failure update auth token");
				});
			}).catch(err => {
				logger.error(err.toString());
				result(res, 50000, "account not exist");
			});
		}
	],

	LogoutAction: [
		[body("authKey").notEmpty(), body("userNo").isNumeric()],
		validationHandler,
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res) => {
			const { authKey, userNo } = req.body;

			accountModel.info.findOne({
				where: { accountDBID: userNo, authKey: authKey }
			}).then(account => {
				if (account === null) {
					return result(res, 50000, "account not exist");
				}

				accountModel.info.update({ authKey: null }, {
					where: { accountDBID: account.get("accountDBID") }
				}).then(() =>
					result(res, 0, "success")
				).catch(err => {
					logger.error(err.toString());
					result(res, 50811, "failure update auth token");
				});
			}).catch(err => {
				logger.error(err.toString());
				result(res, 50000, "account not exist");
			});
		}
	],

	RegisterAction: [
		[
			body("login")
				.isLength({ min: 3, max: 13 }).withMessage("$1")
				.isAlphanumeric().withMessage("$1")
				.custom((value, { req }) => accountModel.info.findOne({
					where: {
						userName: req.body.login
					}
				}).then(user => {
					if (user) {
						return Promise.reject("$0");
					}
				})),
			body("email").isEmail().withMessage("$2"),
			body("password")
				.isLength({ min: 8, max: 14 }).withMessage("$3")
				.isAlphanumeric().withMessage("$3")
		],
		/**
		 * @type {import("express").RequestHandler}
		 */
		(req, res, next) => {
			const errors = helpers.validationResultLog(req);

			if (!errors.isEmpty()) {
				return result(res, 2, errors.array()[0].msg);
			}

			next();
		},
		/**
		 * @type {import("express").RequestHandler}
		 */
		async (req, res) => {
			const { login, password, email } = req.body;
			const authKey = uuid.v4();

			accountModel.info.create({
				userName: login,
				passWord: password,
				authKey,
				email
			}).then(account => {
				result(res, 0, "success", {
					UserNo: account.get("accountDBID"),
					AuthKey: account.get("authKey")
				});
			}).catch(err => {
				logger.error(err.toString());
				result(res, 1, "database error");
			});
		}
	]
};