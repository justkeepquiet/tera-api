"use strict";

const uuid = require("uuid").v4;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const logger = require("../utils/logger");
const SteerConnection = require("../utils/steerConnection");

/**
* @typedef {import("express").Express} Express
*/

const steer = new SteerConnection(
	process.env.ADMIN_PANEL_STEER_HOST,
	process.env.ADMIN_PANEL_STEER_PORT,
	19, "WebIMSTool", { logger }
);

if (/^true$/i.test(process.env.ADMIN_PANEL_STEER_ENABLE)) {
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
			if (/^true$/i.test(process.env.ADMIN_PANEL_STEER_ENABLE)) {
				return steer.checkLoginGetSessionKey(login, password, "127.0.0.1").then(sessionKey =>
					done(null, { login, sessionKey })
				).catch(err =>
					done(null, false, `err_${err.resultCode()}`)
				);
			}

			if (login === process.env.ADMIN_PANEL_QA_LOGIN &&
				password === process.env.ADMIN_PANEL_QA_PASSWORD
			) {
				done(null, { login, password });
			} else {
				done(null, false, "Invalid QA login or password.");
			}
		}
	));

	app.use((req, res, next) => {
		req.steer = steer;
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

	app.use("/", require("./admin/admin.routes"));
};