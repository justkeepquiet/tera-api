"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const uuid = require("uuid");
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const body = require("express-validator").body;
const Recaptcha = require("express-recaptcha").RecaptchaV3;

const helpers = require("../utils/helpers");
const { validationHandler, resultJson } = require("../middlewares/portalLauncher.middlewares");

const ipFromLauncher = /^true$/i.test(process.env.API_ARBITER_USE_IP_FROM_LAUNCHER);

let recaptcha = null;

if (/^true$/i.test(process.env.API_PORTAL_RECAPTCHA_ENABLE)) {
	recaptcha = new Recaptcha(
		process.env.API_PORTAL_RECAPTCHA_SITE_KEY,
		process.env.API_PORTAL_RECAPTCHA_SECRET_KEY, {
			callback: "bindFormAction"
		}
	);
}

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
			startNoCheck: process.env.API_PORTAL_LAUNCHER_DISABLE_CONSISTENCY_CHECK,
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
			disableRegistration: /^true$/i.test(process.env.API_PORTAL_LAUNCHER_DISABLE_REGISTRATION),
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

			if (account === null || account.get("passWord") !== helpers.getPasswordString(password)) {
				logger.warn("Invalid login or password");
				return resultJson(res, 50015, "password error");
			}

			const authKey = uuid.v4();

			accountModel.info.update({
				authKey: authKey,
				...ipFromLauncher ? { lastLoginIP: req.ip } : {}
			}, {
				where: { accountDBID: account.get("accountDBID") }
			}).then(async () => {
				let characterCount = "0";

				try {
					const characters = await accountModel.characters.findAll({
						attributes: ["serverId", [sequelize.fn("COUNT", "characterId"), "charCount"]],
						group: ["serverId"],
						where: { accountDBID: account.get("accountDBID") }
					});

					characterCount = helpers.getCharCountString(characters, account.get("lastLoginServer"), "serverId", "charCount");
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
			.custom(value => accountModel.info.findOne({
				where: {
					userName: value
				}
			}).then(user => {
				if (user) {
					return Promise.reject("$0");
				}
			})),
		body("email").trim()
			.isEmail().withMessage("$2")
			.custom(value => accountModel.info.findOne({
				where: {
					email: value
				}
			}).then(user => {
				if (user) {
					return Promise.reject("$4");
				}
			})),
		body("password").trim()
			.isLength({ min: 8, max: 128 }).withMessage("$3")
			.isStrongPassword().withMessage("$3")
			// .isAlphanumeric().withMessage("$3")
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

			sequelize.transaction(() =>
				accountModel.info.create({
					userName: login,
					passWord: helpers.getPasswordString(password),
					authKey,
					email
				}).then(account => {
					const promises = [];

					helpers.getInitialBenefits().forEach((benefitDays, benefitId) => {
						promises.push(accountModel.benefits.create({
							accountDBID: account.get("accountDBID"),
							benefitId: benefitId,
							availableUntil: sequelize.fn("ADDDATE", sequelize.fn("NOW"), benefitDays)
						}));
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

		if (/^true$/i.test(process.env.API_PORTAL_LAUNCHER_DISABLE_REGISTRATION)) {
			return resultJson(res, 2, "registration disabled");
		}

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