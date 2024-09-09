"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const uuid = require("uuid").v4;
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const body = require("express-validator").body;
const Recaptcha = require("express-recaptcha").RecaptchaV3;

const helpers = require("../utils/helpers");
const { validationHandler, resultJson } = require("../middlewares/portalLauncher.middlewares");

const isRegistrationDisabled = /^true$/i.test(process.env.API_PORTAL_LAUNCHER_DISABLE_REGISTRATION);
const isEmailVerifyEnabled = /^true$/i.test(process.env.API_PORTAL_LAUNCHER_ENABLE_EMAIL_VERIFY);
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
	async (req, res) => {
		try {
			const maintenance = await serverModel.maintenance.findOne({
				where: {
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				}
			});

			if (maintenance !== null) {
				resultJson(res, 0, "success", {
					StartTime: moment(maintenance.get("startTime")).unix(),
					EndTime: moment(maintenance.get("startTime")).unix(),
					Description: maintenance.get("description")
				});
			} else {
				resultJson(res, 0, "success");
			}
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, "Internal error");
		}
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
			isRegistrationDisabled,
			isEmailVerifyEnabled,
			lang: req.query.lang,
			locale: i18n.getLocale()
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordFormHtml = () => [
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		if (!isEmailVerifyEnabled) {
			return res.redirect("LauncherLoginForm");
		}

		res.render("launcherResetPasswordForm", {
			captcha: recaptcha ? recaptcha.render() : ""
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordAction = ({ app, logger, mailer, i18n, accountModel }) => [
	[
		body("email").trim()
			.isEmail().withMessage("$0")
			.custom(value => accountModel.info.findOne({
				where: {
					email: value
				}
			}).then(user => {
				if (user === null) {
					return Promise.reject("$1");
				}
			}))
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
	async (req, res) => {
		try {
			if (!isEmailVerifyEnabled) {
				return resultJson(res, 100, "Email verify disabled.");
			}

			const { email } = req.body;

			const handler = async () => {
				const token = uuid();
				const code = helpers.generateVerificationCode();

				await accountModel.resetPassword.destroy({
					where: { email }
				});

				await accountModel.resetPassword.create({
					token,
					code,
					email
				});

				app.render("./email/resetPasswordVerify", { ...res.locals,
					protocol: req.protocol,
					host: req.hostname,
					brandName: process.env.API_PORTAL_BRAND_NAME || "Tera Private Server",
					code
				}, async (err, html) => {
					if (err) {
						logger.error(err);
						return resultJson(res, 1, "Internal error.");
					}

					try {
						await mailer.sendMail({
							from: `"${process.env.API_PORTAL_EMAIL_FROM_NAME}" <${process.env.API_PORTAL_EMAIL_FROM_ADDRESS}>`,
							to: email,
							subject: i18n.__("Reset Password"),
							html
						});
					} catch (_) {
						logger.error(err);
					}

					resultJson(res, 0, "success", {
						VerifyToken: token
					});
				});
			};

			if (/^true$/i.test(process.env.API_PORTAL_RECAPTCHA_ENABLE)) {
				recaptcha.verify(req, error => {
					if (error) {
						return resultJson(res, 2, "Captcha error");
					}

					handler();
				});
			} else {
				handler();
			}
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, "Internal error.");
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordVerifyFormHtml = ({ logger, accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		if (!req.query.token || !isEmailVerifyEnabled) {
			return res.redirect("LauncherLoginForm");
		}

		try {
			const accountResetPassword = await accountModel.resetPassword.findOne({
				where: {
					token: req.query.token
				}
			});

			if (accountResetPassword === null) {
				return res.redirect("LauncherLoginForm");
			}

			res.render("launcherResetPasswordVerifyForm", {
				email: helpers.maskEmail(accountResetPassword.get("email"))
			});
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, "Internal error.");
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordVerifyAction = ({ logger, i18n, sequelize, accountModel }) => [
	[
		body("password").trim()
			.isLength({ min: 8, max: 128 }).withMessage("$0")
			// .isStrongPassword().withMessage("$0")
			.isAlphanumeric().withMessage("$0"),
		body("token").notEmpty().withMessage("$1"),
		body("code").notEmpty().withMessage("$1")
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return resultJson(res, 2, i18n.__(errors.array()[0].msg));
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		try {
			if (!isEmailVerifyEnabled) {
				return resultJson(res, 100, "Email verify disabled.");
			}

			const { token, code, password } = req.body;

			const accountResetPassword = await accountModel.resetPassword.findOne({
				where: { token }
			});

			if (accountResetPassword === null) {
				return resultJson(res, 2, "$1");
			}

			if (accountResetPassword.get("failsCount") >= 10) {
				await accountModel.resetPassword.destroy({
					where: { token }
				});

				return resultJson(res, 3, "$2");
			}

			if (accountResetPassword.get("code") !== code.toString().replaceAll(",", "").toUpperCase()) {
				await accountModel.resetPassword.increment({ failsCount: 1 }, {
					where: { token }
				});

				return resultJson(res, 2, "Invalid verification code.");
			}

			await sequelize.transaction(async () => {
				await accountModel.resetPassword.destroy({
					where: { token }
				});

				await accountModel.info.update({
					passWord: helpers.getPasswordString(password)
				}, {
					where: { email: accountResetPassword.get("email") }
				});

				resultJson(res, 0, "success");
			});
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, "Internal error.");
		}
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
	async (req, res) => {
		try {
			const { login, password } = req.body;

			const account = await accountModel.info.findOne({ where: { userName: login } });

			if (account === null) {
				return resultJson(res, 50000, "Account not exist");
			}

			if (account === null || account.get("passWord") !== helpers.getPasswordString(password)) {
				logger.warn("Invalid login or password");
				return resultJson(res, 50015, "Password error");
			}

			const authKey = uuid();

			try {
				await accountModel.info.update({
					authKey: authKey,
					...ipFromLauncher ? { lastLoginIP: req.ip } : {}
				}, {
					where: { accountDBID: account.get("accountDBID") }
				});

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
			} catch (err) {
				logger.error(err);
				resultJson(res, 50811, "Failure update auth token");
			}
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, "Internal error");
		}
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
		if (!isEmailVerifyEnabled || isRegistrationDisabled) {
			return res.redirect("LauncherLoginForm");
		}

		res.render("launcherSignupForm", {
			captcha: recaptcha ? recaptcha.render() : ""
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupAction = ({ app, logger, mailer, i18n, sequelize, accountModel }) => [
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
			// .isStrongPassword().withMessage("$3")
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
	async (req, res) => {
		const { login, password, email } = req.body;

		const handler = async () => {
			const token = uuid();

			if (isEmailVerifyEnabled) {
				const code = helpers.generateVerificationCode();

				await accountModel.verify.destroy({
					where: { email }
				});

				await accountModel.verify.create({
					token,
					userName: login,
					code,
					passWord: helpers.getPasswordString(password),
					email
				});

				app.render("./email/emailVerify", { ...res.locals,
					protocol: req.protocol,
					host: req.hostname,
					brandName: process.env.API_PORTAL_BRAND_NAME || "Tera Private Server",
					code
				}, async (err, html) => {
					if (err) {
						logger.error(err);
						return resultJson(res, 1, "Internal error.");
					}

					try {
						await mailer.sendMail({
							from: `"${process.env.API_PORTAL_EMAIL_FROM_NAME}" <${process.env.API_PORTAL_EMAIL_FROM_ADDRESS}>`,
							to: email,
							subject: i18n.__("Confirmation of registration"),
							html
						});
					} catch (_) {
						logger.error(err);
					}

					resultJson(res, 0, "success", {
						VerifyToken: token
					});
				});
			} else {
				await sequelize.transaction(async () => {
					// Create user account
					const account = await accountModel.info.create({
						userName: login,
						passWord: helpers.getPasswordString(password),
						authKey: uuid(),
						email,
						language: i18n.getLocale()
					});

					const promises = [];

					helpers.getInitialBenefits().forEach((benefitDays, benefitId) => {
						promises.push(accountModel.benefits.create({
							accountDBID: account.get("accountDBID"),
							benefitId: benefitId,
							availableUntil: sequelize.fn("ADDDATE", sequelize.fn("NOW"), benefitDays)
						}));
					});

					await Promise.all(promises);

					// Login account
					resultJson(res, 0, "success", {
						UserNo: account.get("accountDBID"),
						AuthKey: account.get("authKey")
					});
				});
			}
		};

		if (isRegistrationDisabled) {
			return resultJson(res, 2, "Registration disabled");
		}

		if (/^true$/i.test(process.env.API_PORTAL_RECAPTCHA_ENABLE)) {
			recaptcha.verify(req, error => {
				if (error) {
					return resultJson(res, 2, "Captcha error");
				}

				handler();
			});
		} else {
			handler();
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupVerifyFormHtml = ({ logger, accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		if (!req.query.token || !isEmailVerifyEnabled || isRegistrationDisabled) {
			return res.redirect("LauncherLoginForm");
		}

		try {
			const accountVerify = await accountModel.verify.findOne({
				where: {
					token: req.query.token
				}
			});

			if (accountVerify === null) {
				return res.redirect("LauncherLoginForm");
			}

			res.render("launcherSignupVerifyForm", {
				email: helpers.maskEmail(accountVerify.get("email"))
			});
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, "Internal error.");
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupVerifyAction = ({ logger, i18n, sequelize, accountModel }) => [
	[
		body("token").notEmpty().withMessage("$0"),
		body("code").notEmpty().withMessage("$0")
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return resultJson(res, 2, i18n.__(errors.array()[0].msg));
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		try {
			if (isRegistrationDisabled) {
				return resultJson(res, 100, "Registration disabled.");
			}

			const { token, code } = req.body;

			const accountVerify = await accountModel.verify.findOne({
				where: { token }
			});

			if (accountVerify === null) {
				return resultJson(res, 2, "$0");
			}

			if (accountVerify.get("failsCount") >= 10) {
				await accountModel.verify.destroy({
					where: { token }
				});

				return resultJson(res, 3, "$1");
			}

			if (accountVerify.get("code") !== code.toString().replaceAll(",", "").toUpperCase()) {
				await accountModel.verify.increment({ failsCount: 1 }, {
					where: { token }
				});

				return resultJson(res, 2, "$0");
			}

			await sequelize.transaction(async () => {
				await accountModel.verify.destroy({
					where: { token }
				});

				// Create user account
				const account = await accountModel.info.create({
					userName: accountVerify.get("userName"),
					passWord: helpers.getPasswordString(accountVerify.get("passWord")),
					authKey: uuid(),
					email: accountVerify.get("email"),
					language: i18n.getLocale()
				});

				const promises = [];

				helpers.getInitialBenefits().forEach((benefitDays, benefitId) => {
					promises.push(accountModel.benefits.create({
						accountDBID: account.get("accountDBID"),
						benefitId: benefitId,
						availableUntil: sequelize.fn("ADDDATE", sequelize.fn("NOW"), benefitDays)
					}));
				});

				await Promise.all(promises);

				// Login account
				resultJson(res, 0, "success", {
					UserNo: account.get("accountDBID"),
					AuthKey: account.get("authKey")
				});
			});
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, "Internal error.");
		}
	}
];