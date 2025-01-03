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

const Benefit = require("../actions/handlers/benefit");
const Shop = require("../actions/handlers/shop");
const helpers = require("../utils/helpers");
const SliderCaptcha = require("../utils/sliderCaptcha");
const ApiError = require("../lib/apiError");
const { validationHandler, apiAuthSessionHandler, authSessionHandler } = require("../middlewares/portalLauncher.middlewares");

const isRegistrationDisabled = /^true$/i.test(process.env.API_PORTAL_LAUNCHER_DISABLE_REGISTRATION);
const isEmailVerifyEnabled = /^true$/i.test(process.env.API_PORTAL_LAUNCHER_ENABLE_EMAIL_VERIFY);
const ipFromLauncher = /^true$/i.test(process.env.API_ARBITER_USE_IP_FROM_LAUNCHER);
const brandName = process.env.API_PORTAL_BRAND_NAME || "Tera Private Server";

let captcha = null;

if (/^true$/i.test(process.env.API_PORTAL_CAPTCHA_ENABLE)) {
	captcha = new SliderCaptcha(path.join(__dirname, "../../data/captcha-images"), 5);
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
module.exports.MainHtml = ({ logger }) => [
	authSessionHandler(),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!req.query.lang) {
			const lang = req?.user?.language || process.env.API_PORTAL_LOCALE;
			return res.redirect(`/launcher/Main?lang=${lang}`);
		}

		res.render("launcherMain", {
			brandName,
			patchNoCheck: /^true$/i.test(process.env.API_PORTAL_CLIENT_PATCH_NO_CHECK),
			startNoCheck: /^true$/i.test(process.env.API_PORTAL_LAUNCHER_DISABLE_CONSISTENCY_CHECK),
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
			region: helpers.languageToRegion(req.user.language || process.env.API_PORTAL_LOCALE),
			regions: helpers.getClientRegions(),
			lang: req.query.lang,
			localeSelector: /^true$/i.test(process.env.API_PORTAL_LOCALE_SELECTOR),
			qaPrivilege: process.env.API_PORTAL_LAUNCHER_QA_PRIVILEGE,
			host: req.headers.host || req.hostname,
			user: req.user,
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
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL
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
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
			isRegistrationDisabled,
			isEmailVerifyEnabled
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.LoginAction = ({ logger, passport, accountModel }) => [
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
		const authKey = uuid();

		await accountModel.info.update({
			authKey: authKey,
			...ipFromLauncher ? { lastLoginIP: req.ip } : {}
		}, {
			where: { accountDBID: req.user.accountDBID }
		});

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Language: req?.user?.language || process.env.API_PORTAL_LOCALE
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
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
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
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL
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

		if (req.session.captchaVerified) {
			next();
		} else {
			next(new ApiError("captcha error", 12));
		}
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { secure } = req.query;
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
					from: `"${process.env.API_PORTAL_EMAIL_FROM_NAME}" <${process.env.API_PORTAL_EMAIL_FROM_ADDRESS}>`,
					to: email,
					subject: i18n.__("Instructions to reset your password"),
					html
				});
			} catch (error) {
				logger.error(error);
			}

			req.session.token = token;
			req.session.captchaVerified = false;

			res.json({
				Return: true,
				ReturnCode: 0,
				Msg: "success"
			});
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordVerifyFormHtml = ({ logger, accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!req.session.token || !isEmailVerifyEnabled) {
			return res.redirect("LoginForm");
		}

		const accountResetPassword = await accountModel.resetPassword.findOne({
			where: { token: req.session.token }
		});

		if (accountResetPassword === null) {
			return res.redirect("LoginForm");
		}

		res.render("launcherResetPasswordVerifyForm", {
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
			email: helpers.maskEmail(accountResetPassword.get("email"))
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.ResetPasswordVerifyAction = ({ logger, sequelize, accountModel }) => [
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
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!isEmailVerifyEnabled) {
			throw new ApiError("email verify disabled", 100);
		}

		const { code, password } = req.body;

		const accountResetPassword = await accountModel.resetPassword.findOne({
			where: { token: req.session.token }
		});

		if (accountResetPassword === null) {
			throw new ApiError("invalid verification code", 11);
		}

		if (accountResetPassword.get("failsCount") >= 10) {
			await accountModel.resetPassword.destroy({
				where: { token: req.session.token }
			});

			throw new ApiError("attempts has been exceeded", 12);
		}

		if (accountResetPassword.get("code") !== code.toString().replaceAll(",", "").toUpperCase()) {
			await accountModel.resetPassword.increment({ failsCount: 1 }, {
				where: { token: req.session.token }
			});

			throw new ApiError("invalid verification code", 11);
		}

		await sequelize.transaction(async () => {
			await accountModel.resetPassword.destroy({
				where: { token: req.session.token }
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
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
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
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupAction = modules => [
	[
		body("login").trim()
			.isLength({ min: 3, max: 13 }).withMessage(11)
			.isAlphanumeric().withMessage(11)
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
			.isEmail().withMessage(12)
			.custom(value => modules.accountModel.info.findOne({
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
		if (isRegistrationDisabled) {
			throw new ApiError("registration disabled", 100);
		}

		if (req.session.captchaVerified) {
			next();
		} else {
			next(new ApiError("captcha error", 15));
		}
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { secure } = req.query;
		const { login, password, email } = req.body;

		const token = uuid();

		if (isEmailVerifyEnabled) {
			const code = helpers.generateVerificationCode();

			await modules.accountModel.verify.destroy({
				where: { email }
			});

			await modules.accountModel.verify.create({
				token,
				userName: login,
				code,
				passWord: helpers.getPasswordString(password),
				email
			});

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
						from: `"${process.env.API_PORTAL_EMAIL_FROM_NAME}" <${process.env.API_PORTAL_EMAIL_FROM_ADDRESS}>`,
						to: email,
						subject: `${modules.i18n.__("Confirm your registration in")} ${brandName}`,
						html
					});
				} catch (error) {
					modules.logger.error(error);
				}

				req.session.token = token;
				req.session.captchaVerified = false;

				res.json({
					Return: true,
					ReturnCode: 0,
					Msg: "success"
				});
			});
		} else {
			await modules.sequelize.transaction(async () => {
				// Create user account
				const account = await modules.accountModel.info.create({
					userName: login,
					passWord: helpers.getPasswordString(password),
					authKey: uuid(),
					email,
					language: helpers.regionToLanguage(process.env.API_PORTAL_CLIENT_DEFAULT_REGION)
				});

				const benefit = new Benefit(modules, account.get("accountDBID"));
				const promises = [];

				helpers.getInitialBenefits().forEach((benefitDays, benefitId) => {
					promises.push(benefit.addBenefit(benefitId, benefitDays));
				});

				await Promise.all(promises);

				const initialShopBalance = parseInt(process.env.API_PORTAL_SHOP_INITIAL_BALANCE || 0);

				if (initialShopBalance > 0) {
					const shop = new Shop(modules, account.get("accountDBID"), null, {
						report: "SignUp"
					});

					await shop.fund(initialShopBalance);
				}

				req.session.captchaVerified = false;

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
	}
];

/**
 * @param {modules} modules
 */
module.exports.SignupVerifyFormHtml = ({ logger, accountModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (!req.session.token || !isEmailVerifyEnabled || isRegistrationDisabled) {
			return res.redirect("Main");
		}

		const accountVerify = await accountModel.verify.findOne({
			where: {
				token: req.session.token
			}
		});

		if (accountVerify === null) {
			return res.redirect("LoginForm");
		}

		res.render("launcherSignupVerifyForm", {
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL,
			email: helpers.maskEmail(accountVerify.get("email"))
		});
	},
	/**
	 * @type {ErrorRequestHandler}
	 */
	(err, req, res, next) => {
		logger.error(err);

		res.render("launcherErrorForm", {
			error: err,
			patchUrl: process.env.API_PORTAL_CLIENT_PATCH_URL
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
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		if (isRegistrationDisabled) {
			throw new ApiError("registration disabled", 100);
		}

		const { code } = req.body;

		const accountVerify = await modules.accountModel.verify.findOne({
			where: { token: req.session.token }
		});

		if (accountVerify === null) {
			throw new ApiError("invalid verification code", 10);
		}

		if (accountVerify.get("failsCount") >= 10) {
			await modules.accountModel.verify.destroy({
				where: { token: req.session.token }
			});

			throw new ApiError("attempts has been exceeded", 11);
		}

		if (accountVerify.get("code") !== code.toString().replaceAll(",", "").toUpperCase()) {
			await modules.accountModel.verify.increment({ failsCount: 1 }, {
				where: { token: req.session.token }
			});

			throw new ApiError("invalid verification code", 10);
		}

		await modules.sequelize.transaction(async () => {
			await modules.accountModel.verify.destroy({
				where: { token: req.session.token }
			});

			// Create user account
			const account = await modules.accountModel.info.create({
				userName: accountVerify.get("userName"),
				passWord: helpers.getPasswordString(accountVerify.get("passWord")),
				authKey: uuid(),
				email: accountVerify.get("email"),
				language: helpers.regionToLanguage(process.env.API_PORTAL_CLIENT_DEFAULT_REGION)
			});

			const benefit = new Benefit(modules, account.get("accountDBID"));
			const promises = [];

			helpers.getInitialBenefits().forEach((benefitDays, benefitId) => {
				promises.push(benefit.addBenefit(benefitId, benefitDays));
			});

			await Promise.all(promises);

			const initialShopBalance = parseInt(process.env.API_PORTAL_SHOP_INITIAL_BALANCE || 0);

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
module.exports.GetAccountInfoAction = ({ logger, sequelize, accountModel }) => [
	apiAuthSessionHandler(),
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

		let lastLoginServer = 0;
		let characterCount = "0";
		let bannedByIp = null;

		try {
			const characters = await accountModel.characters.findAll({
				attributes: ["serverId", [sequelize.fn("COUNT", "characterId"), "charCount"]],
				group: ["serverId"],
				where: { accountDBID: account.get("accountDBID") }
			});

			if (!/^true$/i.test(process.env.API_PORTAL_DISABLE_CLIENT_AUTO_ENTER)) {
				lastLoginServer = account.get("lastLoginServer");
			}

			characterCount = helpers.getCharCountString(characters, lastLoginServer, "serverId", "charCount");

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
			CharacterCount: characterCount,
			Permission: account.get("permission"),
			Privilege: account.get("privilege"),
			Language: account.get("language"),
			Region: helpers.languageToRegion(account.get("language") || process.env.API_PORTAL_LOCALE),
			UserNo: account.get("accountDBID"),
			UserName: account.get("userName"),
			AuthKey: account.get("authKey"),
			Banned: account.get("banned") !== null || bannedByIp !== null
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SetAccountLanguageAction = ({ logger, accountModel }) => [
	apiAuthSessionHandler(),
	[
		body("language")
			.isIn(["cn", "en", "en-US", "fr", "de", "jp", "kr", "ru", "se", "th", "tw"])
			.custom(value => {
				if (helpers.getClientRegions().every(region => region.locale !== value)) {
					return Promise.reject("language code not allowed");
				}
				return Promise.resolve();
			})
	],
	validationHandler(logger),
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
			language: /^true$/i.test(process.env.API_PORTAL_LOCALE_SELECTOR) ?
				language :
				helpers.regionToLanguage(process.env.API_PORTAL_CLIENT_DEFAULT_REGION),
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
module.exports.ReportAction = ({ accountModel, reportModel }) => [
	apiAuthSessionHandler(),
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
module.exports.CaptchaVerify = () => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const verified = captcha.verify(req.session.captchaQuestion, req.body.answer);

		if (verified) {
			req.session.captchaVerified = true;
		}

		res.json({ verified });
	}
];