"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const crypto = require("crypto");
const uuid = require("uuid");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const body = require("express-validator").body;
const helpers = require("../utils/helpers");

const { recaptcha, validationHandler, resultJson } = require("../middlewares/portalLauncher.middlewares");

/**
 * @param {modules} modules
 */
module.exports.MaintenanceStatus = ({ logger, sequelize, serverModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		serverModel.maintenance.findOne({
			where: {
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		}).then(maintenance => {
			if (maintenance !== null) {
				resultJson(res, 0, "success", {
					StartTime: moment(maintenance.get("startTime")).unix(),
					EndTime: moment(maintenance.get("startTime")).unix(),
					Description: maintenance.get("description")
				});
			} else {
				resultJson(res, 0, "success");
			}
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.MainHtml = ({ i18n }) => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.render("launcherMain", {
			brandName: process.env.API_PORTAL_BRAND_NAME || "Tera Private Server",
			patchNoCheck: process.env.API_PORTAL_CLIENT_PATCH_NO_CHECK,
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
			region: process.env.API_PORTAL_CLIENT_DEFAULT_REGION,
			localeSelector: /^true$/i.test(process.env.API_PORTAL_LOCALE_SELECTOR),
			locale: i18n.getLocale(),
			lang: req.query.lang,
			regions: helpers.getClientRegions(),
			helpers
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.LoginFormHtml = ({ i18n }) => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.render("launcherLoginForm", {
			qaPrivilege: process.env.API_PORTAL_LAUNCHER_QA_PRIVILEGE,
			lang: req.query.lang,
			locale: i18n.getLocale()
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupFormHtml = () => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.render("launcherSignupForm", {
			captcha: recaptcha ? recaptcha.render() : ""
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.LoginAction = ({ logger, sequelize, accountModel }) => [
	[body("login").notEmpty(), body("password").notEmpty()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { login, password } = req.body;

		accountModel.info.findOne({ where: { userName: login } }).then(account => {
			if (account === null) {
				return resultJson(res, 50000, "account not exist");
			}

			let passwordString = password;

			if (/^true$/i.test(process.env.API_PORTAL_USE_SHA512_PASSWORDS)) {
				passwordString = crypto.createHash("sha512").update(process.env.API_PORTAL_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
			}

			if (account === null || account.get("passWord") !== passwordString) {
				logger.warn("Invalid login or password");
				return resultJson(res, 50015, "password error");
			}

			const authKey = uuid.v4();

			accountModel.info.update({ authKey: authKey }, {
				where: { accountDBID: account.get("accountDBID") }
			}).then(async () => {
				let characterCount = "0";

				try {
					const characters = await accountModel.characters.findAll({
						attributes: ["serverId", [sequelize.fn("COUNT", "characterId"), "charCount"]],
						group: ["serverId"],
						where: { accountDBID: account.get("accountDBID") }
					});

					if (characters !== null) {
						characterCount = helpers.getCharCountString(characters, account.get("lastLoginServer"), "serverId", "charCount");
					}
				} catch (err) {
					logger.error(err);
				}

				resultJson(res, 0, "success", {
					CharacterCount: characterCount,
					Permission: account.get("permission"),
					Privilege: account.get("privilege"),
					UserNo: account.get("accountDBID"),
					UserName: account.get("userName"),
					AuthKey: authKey
				});
			}).catch(err => {
				logger.error(err);
				resultJson(res, 50811, "failure update auth token");
			});
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, "internal error");
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupAction = ({ logger, sequelize, accountModel }) => [
	[
		body("login").trim()
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
		body("email").trim().isEmail().withMessage("$2"),
		body("password").trim()
			.isLength({ min: 8, max: 14 }).withMessage("$3")
			.isAlphanumeric().withMessage("$3")
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return resultJson(res, 2, errors.array()[0].msg);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const handler = async () => {
			const { login, password, email } = req.body;
			const authKey = uuid.v4();
			let passwordString = password;

			if (/^true$/i.test(process.env.API_PORTAL_USE_SHA512_PASSWORDS)) {
				passwordString = crypto.createHash("sha512").update(process.env.API_PORTAL_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
			}

			sequelize.transaction(transaction =>
				accountModel.info.create({
					userName: login,
					passWord: passwordString,
					authKey,
					email
				}, { transaction }).then(account => {
					const promises = [];

					helpers.getInitialBenefits().forEach((benefitDays, benefitId) => {
						promises.push(accountModel.benefits.create({
							accountDBID: account.get("accountDBID"),
							benefitId: benefitId,
							availableUntil: sequelize.fn("ADDDATE", sequelize.fn("NOW"), benefitDays)
						}, { transaction }));
					});

					return Promise.all(promises).then(() =>
						resultJson(res, 0, "success", {
							UserNo: account.get("accountDBID"),
							AuthKey: account.get("authKey")
						})
					);
				})
			).catch(err => {
				logger.error(err);
				resultJson(res, 1, "internal error");
			});
		};

		if (/^true$/i.test(process.env.API_PORTAL_RECAPTCHA_ENABLE)) {
			recaptcha.verify(req, error => {
				if (error) {
					return resultJson(res, 2, "captcha error");
				}

				handler();
			});
		} else {
			handler();
		}
	}
];