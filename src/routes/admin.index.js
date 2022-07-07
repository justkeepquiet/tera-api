"use strict";

/**
* @typedef {import("../app").modules} modules
*/

const uuid = require("uuid").v4;
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

/**
* @param {modules} modules
*/
module.exports = modules => {
	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	passport.use(new LocalStrategy({ usernameField: "login" },
		(login, password, done) => {
			if (/^true$/i.test(process.env.STEER_ENABLE)) {
				return modules.steer.checkLoginGetSessionKey(login, password, "127.0.0.1").then(({ sessionKey, userSn }) =>
					modules.steer.getFunctionList(sessionKey).then(functions =>
						done(null, {
							type: "steer",
							login,
							userSn,
							sessionKey,
							functions
						})
					)
				).catch(err => {
					if (err.resultCode) {
						if (err.resultCode() < 100) {
							modules.logger.error(err);
						} else {
							modules.logger.warn(err);
						}

						done(null, false, `err_${err.resultCode()}`);
					} else {
						modules.logger.error(err);
						done(null, false, "err_1");
					}
				});
			}

			if (login === process.env.ADMIN_PANEL_QA_USER &&
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

	modules.app.use((req, res, next) => {
		res.locals.__quickMenu = require("../../config/admin").quickMenu;
		next();
	});

	modules.app.use(session({
		genid: () => uuid(),
		store: new FileStore({
			logFn: modules.logger.debug
		}),
		secret: process.env.ADMIN_PANEL_SECRET,
		resave: false,
		saveUninitialized: true
	}));

	modules.app.use(passport.initialize());
	modules.app.use(passport.session());

	modules.app.use("/", require("./admin/admin.routes")(modules));

	modules.app.use((req, res) =>
		res.redirect("/")
	);
};