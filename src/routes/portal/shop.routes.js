"use strict";

/**
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 * @typedef {import("../../app").modules} modules
 */

const path = require("path");
const I18n = require("i18n").I18n;
const express = require("express");
const uuid = require("uuid").v4;
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const Passport = require("passport").Passport;
const CustomStrategy = require("passport-custom").Strategy;

const env = require("../../utils/env");
const helpers = require("../../utils/helpers");
const IpBlockHandler = require("../../utils/ipBlockHandler");
const ApiError = require("../../lib/apiError");
const portalShopController = require("../../controllers/portalShop.controller");

/**
 * @param {modules} modules
 */
module.exports = async modules => {
	if (!modules.config.get("shop")) {
		throw "Cannot read configuration: shop";
	}

	const ipBlock = new IpBlockHandler(modules.geoip, modules.ipapi, modules.logger);
	const passport = new Passport();
	const i18n = new I18n({
		staticCatalog: helpers.loadTranslations(path.resolve(__dirname, "../../locales/shop"), []),
		defaultLocale: env.string("API_PORTAL_LOCALE"),
		header: undefined
	});

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		modules.accountModel.info.findOne({
			where: { accountDBID: user.accountDBID }
		}).then(account => {
			if (account === null) {
				done("Invalid account ID", null);
			} else {
				done(null, account);
			}
		}).catch(err => {
			modules.logger.error(err);
			done(err, null);
		});
	});

	passport.use(new CustomStrategy(
		(req, done) => {
			modules.accountModel.info.findOne({
				where: { authKey: req.query.authKey }
			}).then(account => {
				if (account === null) {
					done("Invalid authKey", null);
				} else {
					done(null, account);
				}
			}).catch(err => {
				modules.logger.error(err);
				done(err, null);
			});
		})
	);

	modules.app.use("/shop", async (req, res, next) => {
		const config = modules.config.get("ipBlock");
		const blocked = await ipBlock.applyBlock(req.ip, res.locals.__endpoint, config);

		if (blocked) {
			res.status(403).json({ Return: false, ReturnCode: 403, Msg: "Access denied" });
		} else {
			next();
		}
	});

	modules.app.use("/shop", session({
		name: "shop.sid",
		genid: () => uuid(),
		store: new MemoryStore(),
		secret: env.string("API_PORTAL_SECRET"),
		resave: false,
		saveUninitialized: true
	}));

	modules.app.use("/shop", passport.initialize());
	modules.app.use("/shop", passport.session());

	modules.app.use("/shop", (err, req, res, next) => {
		if (err) {
			modules.logger.warn(err);

			req.logout(() => next());
		} else {
			next();
		}
	});

	modules.app.use("/shop", (req, res, next) => {
		const locale = req?.user?.language;

		if (i18n.getLocales().includes(locale)) {
			i18n.setLocale(locale);
		}

		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		next();
	});

	const mod = { ...modules, i18n, passport };

	return express.Router()
		// Auth
		.get("/Auth", portalShopController.Auth(mod))

		// Pages
		.get("/Disabled", portalShopController.DisabledHtml(mod))
		.get("/Main", portalShopController.MainHtml(mod))

		// Partials
		.get("/PartialError", portalShopController.PartialErrorHtml(mod))
		.get("/PartialPromoCode", portalShopController.PartialPromoCodeHtml(mod))
		.get("/PartialCoupons", portalShopController.PartialCouponsHtml(mod))
		.get("/PartialWelcome", portalShopController.PartialWelcomeHtml(mod))
		.post("/PartialProduct", portalShopController.PartialProductHtml(mod))

		// API
		.post("/GetAccountInfo", portalShopController.GetAccountInfo(mod))
		.post("/GetCatalog", portalShopController.GetCatalog(mod))
		.post("/ReqCharacterAction", portalShopController.ReqCharacterAction(mod))
		.post("/PurchaseAction", portalShopController.PurchaseAction(mod))
		.post("/PurchaseStatusAction", portalShopController.PurchaseStatusAction(mod))
		.post("/PromoCodeAction", portalShopController.PromoCodeAction(mod))
		.post("/PromoCodeStatusAction", portalShopController.PromoCodeStatusAction(mod))
		.post("/CouponAcceptAction", portalShopController.CouponAcceptAction(mod))
		.post("/CouponCancelAction", portalShopController.CouponCancelAction(mod))

		.use(
			/**
			 * @type {ErrorRequestHandler}
			 */
			(err, req, res, next) => {
				if (err instanceof ApiError) {
					res.json({ Return: false, ReturnCode: err.code, Msg: err.message });
				} else {
					modules.logger.error(err);
					res.status(500).json({ Return: false, ReturnCode: 1, Msg: "Internal Server Error" });
				}
			}
		)
	;
};