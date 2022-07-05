"use strict";

require("dotenv").config();

const logger = require("./utils/logger");
const ExpressServer = require("./utils/expressServer");

if (!process.env.API_ARBITER_LISTEN_PORT) {
	logger.error("Invalid configuration parameter: API_ARBITER_LISTEN_PORT");
	process.exit();
}

if (!process.env.API_PORTAL_LISTEN_PORT) {
	logger.error("Invalid configuration parameter: API_PORTAL_LISTEN_PORT");
	process.exit();
}

if (!process.env.ADMIN_PANEL_LISTEN_PORT) {
	logger.error("Invalid configuration parameter: ADMIN_PANEL_LISTEN_PORT");
	process.exit();
}

const arbiterApi = new ExpressServer("Arbiter API");

arbiterApi.setLogging();
arbiterApi.setRouter(require("./routes/arbiter.index"));

arbiterApi.bind(
	process.env.API_ARBITER_LISTEN_HOST,
	process.env.API_ARBITER_LISTEN_PORT
);

const portalApi = new ExpressServer("Portal API");

if (/^true$/i.test(process.env.API_PORTAL_PUBLIC_FOLDER_ENABLE)) {
	portalApi.setStatic("/public", "public");
}

portalApi.setLogging();
portalApi.setRouter(require("./routes/portal.index"));

portalApi.bind(
	process.env.API_PORTAL_LISTEN_HOST,
	process.env.API_PORTAL_LISTEN_PORT
);

const adminPanel = new ExpressServer("Admin Panel", false);

adminPanel.setStatic("/static", "src/static/admin");
adminPanel.setStatic("/static/images/tera-icons", "data/tera-icons");
adminPanel.setLogging();
adminPanel.setRouter(require("./routes/admin.index"));

adminPanel.bind(
	process.env.ADMIN_PANEL_LISTEN_HOST,
	process.env.ADMIN_PANEL_LISTEN_PORT
);