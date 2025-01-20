"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 */

const path = require("path");
const uuid = require("uuid").v4;
const Op = require("sequelize").Op;
const moment = require("moment-timezone");
const body = require("express-validator").body;

const ApiError = require("../lib/apiError");
const Benefit = require("../actions/handlers/benefit");
const Shop = require("../actions/handlers/shop");
const env = require("../utils/env");
const helpers = require("../utils/helpers");
const SliderCaptcha = require("../utils/sliderCaptcha");

const {
	validationHandler,
	apiAuthSessionHandler,
	authSessionHandler,
	rateLimitterHandler
} = require("../middlewares/portalLauncher.middlewares");

const isRegistrationDisabled = env.bool("API_PORTAL_LAUNCHER_DISABLE_REGISTRATION");
const isEmailVerifyEnabled = env.bool("API_PORTAL_LAUNCHER_ENABLE_EMAIL_VERIFY");
const ipFromLauncher = env.bool("API_ARBITER_USE_IP_FROM_LAUNCHER");
const brandName = env.string("API_PORTAL_BRAND_NAME") || "Tera Private Server";

let captcha = null;

if (env.bool("API_PORTAL_CAPTCHA_ENABLE")) {
	captcha = new SliderCaptcha(path.join(__dirname, "../../data/captcha-images"), 5);
}

/**
 * @param {modules} modules
 */
module.exports.MainHtml = ({ config, localization, logger }) => [
	authSessionHandler(),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const launcherConfig = config.get("launcher");
		const language = req?.user?.language || env.string("API_PORTAL_LOCALE");

		res.render("launcherMain", {
			brandName,
			patchNoCheck: env.bool("API_PORTAL_CLIENT_PATCH_NO_CHECK"),
			startNoCheck: env.bool("API_PORTAL_LAUNCHER_DISABLE_CONSISTENCY_CHECK"),
			qaPrivilege: env.string("API_PORTAL_LAUNCHER_QA_PRIVILEGE"),
			localeSelector: env.bool("API_PORTAL_LOCALE_SELECTOR"),
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL"),
			region: localization.getRegionByLanguage(language),
			localizations: localization.listClientLocalizations(),
			actsMap: launcherConfig.actsMap,
			pagesMap: launcherConfig.pagesMap,
			host: req.headers.host || req.hostname,
			user: req.user,
			language,
			helpers
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.LoginFormHtml = ({ logger }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("launcherLoginForm", {
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL"),
			isPasswordChanged: req.session.passwordChanged,
			isRegistrationDisabled,
			isEmailVerifyEnabled
		});

		req.session.passwordChanged = false;
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.LoginAction = ({ logger, rateLimitter, passport, accountModel }) => [
	[
		body("login").trim().notEmpty().withMessage(10),
		body("password").trim().notEmpty().withMessage(11)
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
	rateLimitterHandler(rateLimitter, "portalApi.launcher.loginAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		passport.authenticate("local", (error, user) => {
			if (error) {
				return next(new ApiError("invalid login or password", 12));
			}

			req.login(user, () => next());
		})(req, res, next);
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Language: req?.user?.language || env.string("API_PORTAL_LOCALE")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.LogoutAction = () => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		req.logout(() =>
			res.redirect("/launcher/LoginForm")
		);
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordFormHtml = ({ i18n, logger }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!isEmailVerifyEnabled) {
			return res.redirect("/launcher/LoginForm");
		}

		req.session.captchaVerified = !captcha;

		const captchaHtml = captcha ? captcha.render("captcha", {
			modal: true,
			width: 280,
			height: 124,
			formText: i18n.__("I am human"),
			loadingText: i18n.__("Loading..."),
			barText: i18n.__("Slide To Verify"),
			serverUrl: "/launcher/GetCaptcha"
		}) : "";

		res.render("launcherResetPasswordForm", {
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL"),
			captcha: captchaHtml
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordAction = ({ app, logger, rateLimitter, mailer, i18n, accountModel }) => [
	[
		body("email").trim()
			.isLength({ max: 128 }).withMessage(10)
			.notEmpty().withMessage(10)
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
	rateLimitterHandler(rateLimitter, "portalApi.launcher.resetPasswordAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!isEmailVerifyEnabled) {
			throw new ApiError("email verify disabled", 100);
		}

		if (req.session.captchaVerified) {
			next();
		} else {
			next(new ApiError("captcha error", 12));
		}
	},
	[
		body("email").trim()
			.custom(value => accountModel.info.findOne({
				where: {
					[Op.or]: [{ email: value }, { userName: value }]
				}
			}).then(account => {
				if (account === null || !account.get("email")) {
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
		const { secure } = req.query;
		const { email } = req.body;

		req.session.captchaVerified = false;

		const account = await accountModel.info.findOne({
			where: {
				[Op.or]: [{ email }, { userName: email }]
			}
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		const code = helpers.generateVerificationCode();
		const ttl = moment().add(1, "hour"); // 1 hour

		logger.debug(`ResetPasswordAction: Generated verification code: ${code}, email: ${account.get("email")}`);

		req.session.resetPasswordVerify = { email: account.get("email"), code, ttl, failsCount: 0 };

		// no awaiting
		app.render("email/resetPasswordVerify", { ...res.locals,
			host: req.headers.host || req.hostname,
			secure: secure === "true",
			brandName,
			code
		}, async (err, html) => {
			if (err) {
				logger.error(err);
				return next(new ApiError("internal error", 1));
			}

			try {
				await mailer.sendMail({
					from: `"${env.string("API_PORTAL_EMAIL_FROM_NAME")}" <${env.string("API_PORTAL_EMAIL_FROM_ADDRESS")}>`,
					to: account.get("email"),
					subject: i18n.__("Instructions to reset your password"),
					html
				});
			} catch (error) {
				logger.error(error);
			}
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
module.exports.ResetPasswordVerifyFormHtml = ({ logger }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		req.session.passwordChanged = false;

		if (!req.session.resetPasswordVerify || !isEmailVerifyEnabled) {
			return res.redirect("LoginForm");
		}

		res.render("launcherResetPasswordVerifyForm", {
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL"),
			email: helpers.maskEmail(req.session.resetPasswordVerify.email)
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordVerifyAction = ({ logger, rateLimitter, accountModel }) => [
	[
		body("password").trim()
			.isLength({ min: 8, max: 128 }).withMessage(10),
		body("code").trim().notEmpty().withMessage(11)
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
	rateLimitterHandler(rateLimitter, "portalApi.launcher.resetPasswordVerifyAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!isEmailVerifyEnabled) {
			throw new ApiError("email verify disabled", 100);
		}

		const { code, password } = req.body;

		if (!req.session.resetPasswordVerify) {
			throw new ApiError("invalid verification code", 11);
		}

		if (moment().isAfter(req.session.resetPasswordVerify.ttl)) {
			throw new ApiError("invalid verification code", 11);
		}

		if (req.session.resetPasswordVerify.failsCount >= 10) {
			req.session.resetPasswordVerify = null;

			throw new ApiError("attempts has been exceeded", 12);
		}

		if (req.session.resetPasswordVerify.code !== code.toString().replaceAll(",", "").toUpperCase()) {
			req.session.resetPasswordVerify.failsCount++;

			throw new ApiError("invalid verification code", 11);
		}

		const email = req.session.resetPasswordVerify.email;

		req.session.resetPasswordVerify = null;
		req.session.passwordChanged = true;

		await accountModel.info.update({
			passWord: helpers.getPasswordString(password)
		}, {
			where: { email }
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
module.exports.SignupFormHtml = ({ i18n, logger }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (isRegistrationDisabled) {
			return res.redirect("LoginForm");
		}

		req.session.captchaVerified = !captcha;

		const captchaHtml = captcha ? captcha.render("captcha", {
			modal: true,
			width: 280,
			height: 124,
			formText: i18n.__("I am human"),
			loadingText: i18n.__("Loading..."),
			barText: i18n.__("Slide To Verify"),
			serverUrl: "/launcher/GetCaptcha"
		}) : "";

		res.render("launcherSignupForm", {
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL"),
			captcha: captchaHtml
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupAction = modules => [
	[
		body("login").trim()
			.isLength({ min: 3, max: 24 }).withMessage(11)
			.isAlphanumeric().withMessage(11),
		body("email").trim()
			.isLength({ max: 128 }).withMessage(12)
			.isEmail().withMessage(12),
		body("password").trim()
			.isLength({ min: 8, max: 128 }).withMessage(13)
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, modules.logger);

		if (!errors.isEmpty()) {
			throw new ApiError("invalid parameter", errors.array()[0].msg);
		}

		next();
	},
	rateLimitterHandler(modules.rateLimitter, "portalApi.launcher.signupAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (isRegistrationDisabled) {
			throw new ApiError("registration disabled", 100);
		}

		if (req.session.captchaVerified) {
			next();
		} else {
			next(new ApiError("captcha error", 15));
		}
	},
	[
		body("login").trim()
			.custom(value => modules.accountModel.info.findOne({
				where: {
					userName: value
				}
			}).then(user => {
				if (user) {
					return Promise.reject(10);
				}
			})),
		body("email").trim()
			.custom(value => modules.accountModel.info.findOne({
				where: {
					email: value
				}
			}).then(user => {
				if (user) {
					return Promise.reject(14);
				}
			}))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, modules.logger);

		if (!errors.isEmpty()) {
			throw new ApiError("invalid parameter", errors.array()[0].msg);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { secure } = req.query;
		const { login, password, email } = req.body;

		req.session.captchaVerified = false;

		if (isEmailVerifyEnabled) {
			const code = helpers.generateVerificationCode();
			const ttl = moment().add(1, "hour"); // 1 hour

			modules.logger.debug(`SignupAction: Generated verification code: ${code}, login: ${login}, email: ${email}`);

			req.session.signupVerify = {
				login,
				password: helpers.getPasswordString(password),
				email,
				code,
				ttl,
				failsCount: 0
			};

			// no awaiting
			modules.app.render("email/emailVerify", { ...res.locals,
				host: req.headers.host || req.hostname,
				secure: secure === "true",
				brandName,
				code
			}, async (err, html) => {
				if (err) {
					modules.logger.error(err);
					return next(new ApiError("internal error", 1));
				}

				try {
					await modules.mailer.sendMail({
						from: `"${env.string("API_PORTAL_EMAIL_FROM_NAME")}" <${env.string("API_PORTAL_EMAIL_FROM_ADDRESS")}>`,
						to: email,
						subject: `${modules.i18n.__("Confirm your registration in")} ${brandName}`,
						html
					});
				} catch (error) {
					modules.logger.error(error);
				}
			});
		} else {
			await modules.sequelize.transaction(async () => {
				// Create user account
				const account = await modules.accountModel.info.create({
					userName: login,
					passWord: helpers.getPasswordString(password),
					email,
					language: modules.localization.getClientLanguageByLocale(req.query.locale)
				});

				const benefit = new Benefit(modules, account.get("accountDBID"));
				const promises = [];

				helpers.getInitialBenefits().forEach((benefitDays, benefitId) => {
					promises.push(benefit.addBenefit(benefitId, benefitDays));
				});

				await Promise.all(promises);

				const initialShopBalance = env.number("API_PORTAL_SHOP_INITIAL_BALANCE", 0);

				if (initialShopBalance > 0) {
					const shop = new Shop(modules, account.get("accountDBID"), null, {
						report: "SignUp"
					});

					await shop.fund(initialShopBalance);
				}
			});
		}

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
module.exports.SignupVerifyFormHtml = ({ logger }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!req.session.signupVerify || !isEmailVerifyEnabled || isRegistrationDisabled) {
			return res.redirect("Main");
		}

		res.render("launcherSignupVerifyForm", {
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL"),
			email: helpers.maskEmail(req.session.signupVerify.email)
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: env.string("API_PORTAL_CLIENT_PATCH_URL")
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupVerifyAction = modules => [
	[
		body("code").trim().notEmpty().withMessage(10)
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const errors = helpers.validationResultLog(req, modules.logger);

		if (!errors.isEmpty()) {
			throw new ApiError("invalid parameter", errors.array()[0].msg);
		}

		next();
	},
	rateLimitterHandler(modules.rateLimitter, "portalApi.launcher.signupVerifyAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (isRegistrationDisabled) {
			throw new ApiError("registration disabled", 100);
		}

		const { code } = req.body;

		if (!req.session.signupVerify) {
			throw new ApiError("invalid verification code", 10);
		}

		if (moment().isAfter(req.session.signupVerify.ttl)) {
			throw new ApiError("invalid verification code", 10);
		}

		if (req.session.signupVerify.failsCount >= 10) {
			req.session.signupVerify = null;

			throw new ApiError("attempts has been exceeded", 11);
		}

		if (req.session.signupVerify.code !== code.toString().replaceAll(",", "").toUpperCase()) {
			req.session.signupVerify.failsCount++;

			throw new ApiError("invalid verification code", 10);
		}

		const userName = req.session.signupVerify.login;
		const passWord = helpers.getPasswordString(req.session.signupVerify.password);
		const email = req.session.signupVerify.email;

		req.session.signupVerify = null;

		await modules.sequelize.transaction(async () => {
			// Create user account
			const account = await modules.accountModel.info.create({
				userName,
				passWord,
				email,
				language: modules.localization.getClientLanguageByLocale(req.query.locale)
			});

			const benefit = new Benefit(modules, account.get("accountDBID"));
			const promises = [];

			helpers.getInitialBenefits().forEach((benefitDays, benefitId) => {
				promises.push(benefit.addBenefit(benefitId, benefitDays));
			});

			await Promise.all(promises);

			const initialShopBalance = env.number("API_PORTAL_SHOP_INITIAL_BALANCE", 0);

			if (initialShopBalance > 0) {
				const shop = new Shop(modules, account.get("accountDBID"), null, {
					report: "SignUp"
				});

				await shop.fund(initialShopBalance);
			}

			// Login account
			req.login(account, () => {
				res.json({
					Return: true,
					ReturnCode: 0,
					Msg: "success"
				});
			});
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetAccountInfoAction = ({ config, localization, logger, rateLimitter, sequelize, accountModel }) => [
	apiAuthSessionHandler(),
	rateLimitterHandler(rateLimitter, "portalApi.launcher.getAccountInfoAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const account = await accountModel.info.findOne({
			where: { accountDBID: req.user.accountDBID },
			include: [{
				as: "banned",
				model: accountModel.bans,
				where: {
					active: 1,
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				},
				required: false
			}]
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		let bannedByIp = null;

		try {
			bannedByIp = await accountModel.bans.findOne({
				where: {
					active: 1,
					ip: { [Op.like]: `%"${req.ip}"%` },
					startTime: { [Op.lt]: sequelize.fn("NOW") },
					endTime: { [Op.gt]: sequelize.fn("NOW") }
				}
			});
		} catch (err) {
			logger.error(err);
		}

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Permission: account.get("permission"),
			Privilege: account.get("privilege"),
			Language: account.get("language"),
			Region: localization.getRegionByLanguage(account.get("language") || env.string("API_PORTAL_LOCALE"), config),
			UserNo: account.get("accountDBID"),
			UserName: account.get("userName"),
			Banned: account.get("banned") !== null || bannedByIp !== null
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SetAccountLanguageAction = ({ localization, logger, rateLimitter, accountModel }) => [
	apiAuthSessionHandler(),
	[
		body("language").trim()
			.isIn(localization.listAllLanguages())
			.custom(value => {
				if (localization.listClientLanguages().every(language => language !== value)) {
					return Promise.reject("language code not allowed");
				}
				return Promise.resolve();
			})
	],
	validationHandler(logger),
	rateLimitterHandler(rateLimitter, "portalApi.launcher.setAccountLanguageAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { language } = req.body;

		const account = await accountModel.info.findOne({
			where: { accountDBID: req.user.accountDBID }
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		await accountModel.info.update({
			language: env.bool("API_PORTAL_LOCALE_SELECTOR") ?
				language :
				localization.getLanguageByRegion(env.string("API_PORTAL_CLIENT_DEFAULT_REGION")),
			...ipFromLauncher ? { lastLoginIP: req.ip } : {}
		}, {
			where: { accountDBID: account.get("accountDBID") }
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
module.exports.GetCharacterCountAction = ({ logger, rateLimitter, sequelize, accountModel }) => [
	apiAuthSessionHandler(),
	rateLimitterHandler(rateLimitter, "portalApi.launcher.getCharacterCountAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const account = await accountModel.info.findOne({
			where: { accountDBID: req.user.accountDBID }
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		let characters = [];

		try {
			characters = await accountModel.characters.findAll({
				attributes: ["serverId", [sequelize.fn("COUNT", "characterId"), "charCount"]],
				group: ["serverId"],
				where: { accountDBID: account.get("accountDBID") }
			});
		} catch (err) {
			logger.error(err);
		}

		let lastLoginServer = 0;

		if (!env.bool("API_PORTAL_DISABLE_CLIENT_AUTO_ENTER")) {
			lastLoginServer = account.get("lastLoginServer");
		}

		const characterCount = helpers.getCharCountString(characters, lastLoginServer, "serverId", "charCount");

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			CharacterCount: characterCount
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetAuthKeyAction = ({ rateLimitter, accountModel }) => [
	apiAuthSessionHandler(),
	rateLimitterHandler(rateLimitter, "portalApi.launcher.getAuthKeyAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const authKey = uuid();

		await accountModel.info.update({
			authKey,
			...ipFromLauncher ? { lastLoginIP: req.ip } : {}
		}, {
			where: { accountDBID: req.user.accountDBID }
		});

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			AuthKey: authKey
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.GetMaintenanceStatusAction = ({ sequelize, serverModel }) => [
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
				EndTime: moment(maintenance.get("startTime")).unix()
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
module.exports.ReportAction = ({ rateLimitter, accountModel, reportModel }) => [
	apiAuthSessionHandler(),
	rateLimitterHandler(rateLimitter, "portalApi.launcher.reportAction"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const account = await accountModel.info.findOne({
			where: { accountDBID: req.user.accountDBID },
			attributes: ["accountDBID"]
		});

		if (account === null) {
			throw new ApiError("account not exist", 50000);
		}

		let action = req.body.action;
		let label = req.body.label;
		let optLabel = req.body.optLabel;
		let version = null;

		if (req.body.version !== undefined && req.body.code1 !== undefined && req.body.code2 !== undefined) {
			action = "crash_game";
			label = req.body.code1;
			optLabel = req.body.code2;
			version = req.body.version;
		}

		await reportModel.launcher.create({
			accountDBID: req.user.accountDBID,
			ip: req.ip,
			action,
			label,
			optLabel,
			version
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
module.exports.CaptchaCreate = () => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const generated = await captcha.generate(280, 124);

		req.session.captchaVerified = false;
		req.session.captchaQuestion = generated.question.x;

		res.json({
			image: generated.image,
			block: generated.block
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.CaptchaVerify = ({ logger, rateLimitter }) => [
	[
		body("answer").trim().notEmpty()
	],
	validationHandler(logger),
	rateLimitterHandler(rateLimitter, "portalApi.launcher.captchaVerify"),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const verified = captcha.verify(req.session.captchaQuestion, req.body.answer);

		if (!verified) {
			req.session.captchaQuestion = undefined;
		} else {
			rateLimitter.delete("portalApi.launcher.captchaVerify", req.ip);
		}

		req.session.captchaVerified = verified;

		res.json({ verified });
	}
];