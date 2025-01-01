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

const ApiError = require("../../lib/apiError");
const portalShopController = require("../../controllers/portalShop.controller");

/**
 * @param {modules} modules
 */
module.exports = modules => {
	const passport = new Passport();
	const i18n = new I18n({
		directory: path.resolve(__dirname, "../../locales/shop"),
		defaultLocale: process.env.API_PORTAL_LOCALE
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

	modules.app.use("/shop", session({
		name: "shop.sid",
		genid: () => uuid(),
		store: new MemoryStore(),
		secret: process.env.API_PORTAL_SECRET,
		resave: false,
		saveUninitialized: true
	}));

	modules.app.use("/shop", passport.initialize());
	modules.app.use("/shop", passport.session());

	modules.app.use((req, res, next) => {
		const locale = (req?.user?.language || process.env.API_PORTAL_LOCALE).split("-")[0];

		if (i18n.getLocales().includes(locale)) {
			i18n.setLocale(locale);
		}

		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		next();
	});

	const mod = { ...modules, i18n, passport };

	return express.Router()
		.get("/ShopAuth", portalShopController.Auth(mod))
		.get("/ShopDisabled", portalShopController.DisabledHtml(mod))
		.get("/ShopMain", portalShopController.MainHtml(mod))
		.get("/ShopPartialError", portalShopController.PartialErrorHtml(mod))
		.get("/ShopPartialPromoCode", portalShopController.PartialPromoCodeHtml(mod))
		.get("/ShopPartialMenu", portalShopController.PartialMenuHtml(mod))
		.get("/ShopPartialWelcome", portalShopController.PartialWelcomeHtml(mod))
		.post("/ShopPartialCatalog", portalShopController.PartialCatalogHtml(mod))
		.post("/ShopPartialProduct", portalShopController.PartialProductHtml(mod))
		.post("/ShopGetAccountInfo", portalShopController.GetAccountInfo(mod))
		.post("/ShopPurchaseAction", portalShopController.PurchaseAction(mod))
		.post("/ShopPromoCodeAction", portalShopController.PromoCodeAction(mod))

		.use(
			/**
			 * @type {ErrorRequestHandler}
			 */
			(err, req, res, next) => {
				if (err instanceof ApiError) {
					res.json({ Return: false, ReturnCode: err.code, Msg: err.message });
				} else {
					modules.logger.error(err);
					res.json({ Return: false, ReturnCode: 1, Msg: "internal error" });
				}
			}
		)
	;
};