"use strict";

const express = require("express");
const portalSlsController = require("../../controllers/portalSls.controller");
const portalAccountController = require("../../controllers/portalAccount.controller");
const portalLauncherController = require("../../controllers/portalLauncher.controller");
const portalShopController = require("../../controllers/portalShop.controller");

module.exports = express.Router()
	// Interfaces
	.get("/ServerList", ...portalSlsController.GetServerListXml)
	.post("/GetAccountInfoByUserNo", ...portalAccountController.GetAccountInfo)
	// Launcher
	.get("/LauncherMaintenanceStatus", ...portalLauncherController.MaintenanceStatus)
	.get("/LauncherMain", ...portalLauncherController.MainHtml)
	.get("/LauncherLoginForm", ...portalLauncherController.LoginFormHtml)
	.get("/LauncherSignupForm", ...portalLauncherController.SignupFormHtml)
	.post("/LauncherLoginAction", ...portalLauncherController.LoginAction)
	.post("/LauncherSignupAction", ...portalLauncherController.SignupAction)
	// Shop
	.get("/ShopAuth", ...portalShopController.Auth)
	.get("/ShopMain", ...portalShopController.MainHtml)
	.get("/ShopPartialError", ...portalShopController.PartialErrorHtml)
	.get("/ShopPartialPromoCode", ...portalShopController.PartialPromoCodeHtml)
	.get("/ShopPartialMenu", ...portalShopController.PartialMenuHtml)
	.get("/ShopPartialWelcome", ...portalShopController.PartialWelcomeHtml)
	.post("/ShopPartialCatalog", ...portalShopController.PartialCatalogHtml)
	.post("/ShopPartialProduct", ...portalShopController.PartialProductHtml)
	.post("/ShopGetAccountInfo", ...portalShopController.GetAccountInfo)
	.post("/ShopPurchaseAction", ...portalShopController.PurchaseAction)
	.post("/ShopPromoCodeAction", ...portalShopController.PromoCodeAction)
;