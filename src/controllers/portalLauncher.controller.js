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
const ApiError = require("../lib/apiError");
const { validationHandler } = require("../middlewares/portalLauncher.middlewares");

const isRegistrationDisabled = /^true$/i.test(process.env.API_PORTAL_LAUNCHER_DISABLE_REGISTRATION);
const isEmailVerifyEnabled = /^true$/i.test(process.env.API_PORTAL_LAUNCHER_ENABLE_EMAIL_VERIFY);
const ipFromLauncher = /^true$/i.test(process.env.API_ARBITER_USE_IP_FROM_LAUNCHER);
const brandName = process.env.API_PORTAL_BRAND_NAME || "Tera Private Server";

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
module.exports.MaintenanceStatus = ({ sequelize, serverModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const maintenance = await serverModel.maintenance.findOne({
			where: {
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		});

		if (maintenance !== null) {
			res.json({
				Return: true,
				ReturnCode: 0,
				Msg: "success",
				StartTime: moment(maintenance.get("startTime")).unix(),
				EndTime: moment(maintenance.get("startTime")).unix(),
				Description: maintenance.get("description")
			});
		} else {
			res.json({
				Return: true,
				ReturnCode: 0,
				Msg: "success"
			});
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.MainHtml = () => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("launcherMain", {
			brandName,
			patchNoCheck: /^true$/i.test(process.env.API_PORTAL_CLIENT_PATCH_NO_CHECK),
			startNoCheck: /^true$/i.test(process.env.API_PORTAL_LAUNCHER_DISABLE_CONSISTENCY_CHECK),
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
			region: helpers.languageToRegion(req.query.lang || process.env.API_PORTAL_LOCALE),
			lang: req.query.lang,
			localeSelector: /^true$/i.test(process.env.API_PORTAL_LOCALE_SELECTOR),
			regions: helpers.getClientRegions(),
			helpers
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.LoginFormHtml = () => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("launcherLoginForm", {
			qaPrivilege: process.env.API_PORTAL_LAUNCHER_QA_PRIVILEGE,
			isRegistrationDisabled,
			isEmailVerifyEnabled
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
	async (req, res, next) => {
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
			.isEmail().withMessage(10)
			.custom(value => accountModel.info.findOne({
				where: {
					email: value
				}
			}).then(user => {
				if (user === null) {
					return Promise.reject(11);
				}
			}))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			throw new ApiError("invalid parameter", errors.array()[0].msg);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!isEmailVerifyEnabled) {
			throw new ApiError("email verify disabled", 100);
		}

		if (recaptcha) {
			recaptcha.verify(req, async error => {
				if (error) {
					next(new ApiError("captcha error", 12));
				} else {
					next();
				}
			});
		} else {
			next();
		}
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { email } = req.body;

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

		app.render("email/resetPasswordVerify", { ...res.locals,
			protocol: req.protocol,
			host: req.hostname,
			brandName,
			code
		}, async (err, html) => {
			if (err) {
				logger.error(err);
				return next(new ApiError("internal error", 1));
			}

			try {
				await mailer.sendMail({
					from: `"${process.env.API_PORTAL_EMAIL_FROM_NAME}" <${process.env.API_PORTAL_EMAIL_FROM_ADDRESS}>`,
					to: email,
					subject: i18n.__("Instructions to reset your password"),
					html
				});
			} catch (error) {
				logger.error(error);
			}

			res.json({
				Return: true,
				ReturnCode: 0,
				Msg: "success",
				VerifyToken: token
			});
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordVerifyFormHtml = ({ accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!req.query.token || !isEmailVerifyEnabled) {
			return res.redirect("LauncherLoginForm");
		}

		const accountResetPassword = await accountModel.resetPassword.findOne({
			where: { token: req.query.token }
		});

		if (accountResetPassword === null) {
			return res.redirect("LauncherLoginForm");
		}

		res.render("launcherResetPasswordVerifyForm", {
			email: helpers.maskEmail(accountResetPassword.get("email"))
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordVerifyAction = ({ logger, sequelize, accountModel }) => [
	[
		body("password").trim()
			.isLength({ min: 8, max: 128 }).withMessage(10)
			// .isStrongPassword().withMessage(10)
			.isAlphanumeric().withMessage(10),
		body("token").notEmpty().withMessage(11),
		body("code").notEmpty().withMessage(11)
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			throw new ApiError("invalid parameter", errors.array()[0].msg);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!isEmailVerifyEnabled) {
			throw new ApiError("email verify disabled", 100);
		}

		const { token, code, password } = req.body;

		const accountResetPassword = await accountModel.resetPassword.findOne({
			where: { token }
		});

		if (accountResetPassword === null) {
			throw new ApiError("invalid verification code", 11);
		}

		if (accountResetPassword.get("failsCount") >= 10) {
			await accountModel.resetPassword.destroy({
				where: { token }
			});

			throw new ApiError("attempts has been exceeded", 12);
		}

		if (accountResetPassword.get("code") !== code.toString().replaceAll(",", "").toUpperCase()) {
			await accountModel.resetPassword.increment({ failsCount: 1 }, {
				where: { token }
			});

			throw new ApiError("invalid verification code", 2);
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
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
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
	async (req, res, next) => {
		const { login, password } = req.body;

		const account = await accountModel.info.findOne({ where: { userName: login } });

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		if (account === null || account.get("passWord") !== helpers.getPasswordString(password)) {
			logger.warn("Invalid login or password");
			throw new ApiError("password error", 50015);
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

			res.json({
				Return: true,
				ReturnCode: 0,
				Msg: "success",
				CharacterCount: characterCount,
				Permission: account.get("permission"),
				Privilege: account.get("privilege"),
				UserNo: account.get("accountDBID"),
				UserName: account.get("userName"),
				AuthKey: authKey
			});
		} catch (err) {
			logger.error(err);
			throw new ApiError("failure update auth token", 50811);
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
	async (req, res, next) => {
		if (isRegistrationDisabled) {
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
			.isLength({ min: 3, max: 13 }).withMessage(11)
			.isAlphanumeric().withMessage(11)
			.custom(value => accountModel.info.findOne({
				where: {
					userName: value
				}
			}).then(user => {
				if (user) {
					return Promise.reject(10);
				}
			})),
		body("email").trim()
			.isEmail().withMessage(12)
			.custom(value => accountModel.info.findOne({
				where: {
					email: value
				}
			}).then(user => {
				if (user) {
					return Promise.reject(14);
				}
			})),
		body("password").trim()
			.isLength({ min: 8, max: 128 }).withMessage(13)
			// .isStrongPassword().withMessage(13)
			.isAlphanumeric().withMessage(13)
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			throw new ApiError("invalid parameter", errors.array()[0].msg);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (isRegistrationDisabled) {
			throw new ApiError("registration disabled", 100);
		}

		if (recaptcha) {
			recaptcha.verify(req, async error => {
				if (error) {
					next(new ApiError("captcha error", 15));
				} else {
					next();
				}
			});
		} else {
			next();
		}
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { login, password, email } = req.body;

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

			app.render("email/emailVerify", { ...res.locals,
				protocol: req.protocol,
				host: req.hostname,
				brandName,
				code
			}, async (err, html) => {
				if (err) {
					logger.error(err);
					return next(new ApiError("internal error", 1));
				}

				try {
					await mailer.sendMail({
						from: `"${process.env.API_PORTAL_EMAIL_FROM_NAME}" <${process.env.API_PORTAL_EMAIL_FROM_ADDRESS}>`,
						to: email,
						subject: `${i18n.__("Confirm your registration in")} ${brandName}`,
						html
					});
				} catch (error) {
					logger.error(error);
				}

				res.json({
					Return: true,
					ReturnCode: 0,
					Msg: "success",
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
					email
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
				res.json({
					Return: true,
					ReturnCode: 0,
					Msg: "success",
					UserNo: account.get("accountDBID"),
					AuthKey: account.get("authKey")
				});
			});
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupVerifyFormHtml = ({ accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!req.query.token || !isEmailVerifyEnabled || isRegistrationDisabled) {
			return res.redirect("LauncherLoginForm");
		}

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
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupVerifyAction = ({ logger, sequelize, accountModel }) => [
	[
		body("token").notEmpty().withMessage(10),
		body("code").notEmpty().withMessage(10)
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			throw new ApiError("invalid parameter", errors.array()[0].msg);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (isRegistrationDisabled) {
			throw new ApiError("registration disabled", 100);
		}

		const { token, code } = req.body;

		const accountVerify = await accountModel.verify.findOne({
			where: { token }
		});

		if (accountVerify === null) {
			throw new ApiError("invalid verification code", 10);
		}

		if (accountVerify.get("failsCount") >= 10) {
			await accountModel.verify.destroy({
				where: { token }
			});

			throw new ApiError("attempts has been exceeded", 11);
		}

		if (accountVerify.get("code") !== code.toString().replaceAll(",", "").toUpperCase()) {
			await accountModel.verify.increment({ failsCount: 1 }, {
				where: { token }
			});

			throw new ApiError("invalid verification code", 10);
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
				email: accountVerify.get("email")
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
			res.json({
				Return: true,
				ReturnCode: 0,
				Msg: "success",
				UserNo: account.get("accountDBID"),
				AuthKey: account.get("authKey")
			});
		});
	}
];