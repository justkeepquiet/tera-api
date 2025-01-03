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
		} else {
			i18n.setLocale(process.env.API_PORTAL_LOCALE);
		}

		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		next();
	});

	const mod = { ...modules, i18n, passport };

	return express.Router()
		.get("/Auth", portalShopController.Auth(mod))
		.get("/Disabled", portalShopController.DisabledHtml(mod))
		.get("/Main", portalShopController.MainHtml(mod))
		.get("/PartialError", portalShopController.PartialErrorHtml(mod))
		.get("/PartialPromoCode", portalShopController.PartialPromoCodeHtml(mod))
		.get("/PartialMenu", portalShopController.PartialMenuHtml(mod))
		.get("/PartialWelcome", portalShopController.PartialWelcomeHtml(mod))
		.post("/PartialCatalog", portalShopController.PartialCatalogHtml(mod))
		.post("/PartialProduct", portalShopController.PartialProductHtml(mod))
		.post("/GetAccountInfo", portalShopController.GetAccountInfo(mod))
		.post("/PurchaseAction", portalShopController.PurchaseAction(mod))
		.post("/PromoCodeAction", portalShopController.PromoCodeAction(mod))

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