"use strict";

const uuid = require("uuid").v4;
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const logger = require("../utils/logger");
const SteerFunctions = require("../utils/steerFunctions");

/**
* @typedef {import("express").Express} Express
*/

const steerEnabled = /^true$/i.test(process.env.ADMIN_PANEL_STEER_ENABLE);

const PlatformFunctions = require("../utils/platformFunctions");

const platform = new PlatformFunctions(
	process.env.ADMIN_PANEL_HUB_GW_HOST,
	process.env.ADMIN_PANEL_HUB_GW_PORT,
	19, { logger }
);

const steer = new SteerFunctions(
	process.env.ADMIN_PANEL_STEER_HOST,
	process.env.ADMIN_PANEL_STEER_PORT,
	19, "WebIMSTool", { logger }
);

if (steerEnabled) {
	steer.connect().catch(err =>
		logger.error(err.toString())
	);
}

/**
* @param {Express} app
*/
module.exports = app => {
	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	passport.use(new LocalStrategy({ usernameField: "login" },
		(login, password, done) => {
			if (steerEnabled) {
				return steer.checkLoginGetSessionKey(login, password, "127.0.0.1").then(({ sessionKey, userSn }) =>
					steer.getFunctionList(sessionKey).then(functions =>
						done(null, {
							type: "steer",
							login,
							userSn,
							sessionKey,
							functions
						})
					)
				).catch(err =>
					done(null, false, `err_${err.resultCode()}`)
				);
			}

			if (login === process.env.ADMIN_PANEL_QA_LOGIN &&
				password === process.env.ADMIN_PANEL_QA_PASSWORD
			) {
				done(null, {
					type: "qa",
					login,
					password
				});
			} else {
				done(null, false, "Invalid QA login or password.");
			}
		}
	));

	app.use((req, res, next) => {
		req.steer = steer;
		req.platform = platform;
		res.locals.__quickMenu = require("../../config/admin").quickMenu;

		next();
	});

	app.use(session({
		genid: () => uuid(),
		store: new FileStore(),
		secret: process.env.ADMIN_PANEL_SECRET,
		resave: false,
		saveUninitialized: true
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	app.use("/static/images/tera-icons", express.static("data/tera-icons"));
	app.use("/", require("./admin/admin.routes"));

	app.use((req, res) =>
		res.redirect("/")
	);
};