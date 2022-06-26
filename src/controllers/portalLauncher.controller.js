"use strict";

const path = require("path");
const crypto = require("crypto");
const uuid = require("uuid");
const I18n = require("i18n").I18n;
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const body = require("express-validator").body;
const Recaptcha = require("express-recaptcha").RecaptchaV3;
const logger = require("../utils/logger");
const helpers = require("../utils/helpers");
const accountModel = require("../models/account.model");

let recaptcha = null;

if (/^true$/i.test(process.env.API_PORTAL_RECAPTCHA_ENABLE)) {
	recaptcha = new Recaptcha(
		process.env.API_PORTAL_RECAPTCHA_SITE_KEY,
		process.env.API_PORTAL_RECAPTCHA_SECRET_KEY, {
			callback: "bindFormAction"
		}
	);
}

if (!process.env.API_PORTAL_LOCALE) {
	logger.error("Invalid configuration parameter: API_PORTAL_LOCALE");
	process.exit();
}

if (!process.env.API_PORTAL_CLIENT_DEFAULT_REGION) {
	logger.error("Invalid configuration parameter: API_PORTAL_CLIENT_DEFAULT_REGION");
	process.exit();
}

const i18n = new I18n({
	directory: path.resolve(__dirname, "../locales/launcher"),
	defaultLocale: process.env.API_PORTAL_LOCALE
});

/**
 * @type {import("express").RequestHandler}
 */
const i18nHandler = (req, res, next) => {
	res.locals.__ = i18n.__;
	res.locals.locale = i18n.getLocale();

	return next();
};

/**
 * @type {import("express").RequestHandler}
 */
const validationHandler = (req, res, next) => {
	if (!helpers.validationResultLog(req).isEmpty()) {
		return resultJson(res, 2, "invalid parameter");
	}

	next();
};

/**
 * @param {import("express").Response} res
 */
const resultJson = (res, code, message, params = {}) => res.json({
	Return: code === 0, ReturnCode: code, Msg: message, ...params
});

module.exports.MaintenanceStatus = [
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
				resultJson(res, 0, "success", {
					StartTime: moment(maintenance.get("startTime")).unix(),
					EndTime: moment(maintenance.get("startTime")).unix(),
					Description: maintenance.get("description")
				});
			} else {
				resultJson(res, 0, "success");
			}
		}).catch(err => {
			logger.error(err.toString());
			resultJson(res, 1, "internal error");
		});
	}
];

module.exports.MainHtml = [
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
			brandName: process.env.API_PORTAL_BRAND_NAME || "Tera Private Server",
			patchNoCheck: process.env.API_PORTAL_CLIENT_PATCH_NO_CHECK,
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
			region: process.env.API_PORTAL_CLIENT_DEFAULT_REGION,
			regions
		});
	}
];

module.exports.LoginFormHtml = [
	i18nHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("launcherLoginForm", {
			qaPrivilege: process.env.API_PORTAL_LAUNCHER_QA_PRIVILEGE
		});
	}
];

module.exports.SignupFormHtml = [
	i18nHandler,
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		res.render("launcherSignupForm", {
			captcha: recaptcha ? recaptcha.render() : ""
		});
	}
];

module.exports.LoginAction = [
	[body("login").notEmpty(), body("password").notEmpty()],
	validationHandler,
	/**
	 * @type {import("express").RequestHandler}
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
						attributes: ["serverId", [accountModel.characters.sequelize.fn("COUNT", "characterId"), "charCount"]],
						group: ["serverId"],
						where: { accountDBID: account.get("accountDBID") }
					});

					if (characters !== null) {
						characterCount = helpers.getCharCountString(characters, account.get("lastLoginServer"), "serverId", "charCount");
					}
				} catch (err) {
					logger.error(err.toString());
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
				logger.error(err.toString());
				resultJson(res, 50811, "failure update auth token");
			});
		}).catch(err => {
			logger.error(err.toString());
			resultJson(res, 1, "internal error");
		});
	}
];

module.exports.SignupAction = [
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
	 * @type {import("express").RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req);

		if (!errors.isEmpty()) {
			return resultJson(res, 2, errors.array()[0].msg);
		}

		next();
	},
	/**
	 * @type {import("express").RequestHandler}
	 */
	(req, res) => {
		const handler = async () => {
			const { login, password, email } = req.body;
			const initialBenefits = new Map();
			const authKey = uuid.v4();
			let passwordString = password;

			if (/^true$/i.test(process.env.API_PORTAL_USE_SHA512_PASSWORDS)) {
				passwordString = crypto.createHash("sha512").update(process.env.API_PORTAL_USE_SHA512_PASSWORDS_SALT + password).digest("hex");
			}

			Object.keys(process.env).forEach(key => {
				const found = key.match(/API_PORTAL_INITIAL_BENEFIT_ID_(\d+)_DAYS$/);

				if (found) {
					const days = Number(process.env[key]);

					if (days > 0) {
						initialBenefits.set(found[1], Math.min(days, 3600));
					}
				}
			});

			accountModel.sequelize.transaction(transaction =>
				accountModel.info.create({
					userName: login,
					passWord: passwordString,
					authKey,
					email
				}, { transaction }).then(account => {
					const promises = [];

					initialBenefits.forEach((benefitDays, benefitId) => {
						promises.push(accountModel.benefits.create({
							accountDBID: account.get("accountDBID"),
							benefitId: benefitId,
							availableUntil: accountModel.sequelize.fn("ADDDATE", accountModel.sequelize.fn("NOW"), benefitDays)
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
				logger.error(err.toString());
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