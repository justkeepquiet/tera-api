"use strict";

/**
* @typedef {import("../../app").modules} modules
*/

const path = require("path");
const I18n = require("i18n").I18n;
const express = require("express");

const portalShopController = require("../../controllers/portalShop.controller");

/**
* @param {modules} modules
*/
module.exports = modules => {
	const i18n = new I18n({
		directory: path.resolve(__dirname, "../../locales/shop"),
		defaultLocale: process.env.API_PORTAL_LOCALE
	});

	const mod = { ...modules, i18n };

	modules.app.use((req, res, next) => {
		res.locals.__ = i18n.__;
		res.locals.locale = i18n.getLocale();

		return next();
	});

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
	;
};