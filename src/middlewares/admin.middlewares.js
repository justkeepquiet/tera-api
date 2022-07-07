"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 */

/**
 * @type {RequestHandler}
 */
module.exports.accessFunctionHandler = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.locals.passport = req.session.passport;

		if (req.session.passport.user.type === "steer" &&
			!Object.values(req.session.passport.user.functions).includes(req.path)
		) {
			const msg = `${encodeURI(res.locals.__("Function access denied"))}: ${req.path}`;
			return res.redirect(`/logout?msg=${msg}`);
		}

		next();
	} else {
		res.redirect(`/login?msg=${encodeURI(res.locals.__("The session has expired."))}&url=${req.url}`);
	}
};

/**
 * @type {RequestHandler}
 */
module.exports.shopStatusHandler = (req, res, next) => {
	if (!/^true$/i.test(process.env.API_PORTAL_SHOP_ENABLE)) {
		return res.redirect("/");
	}

	next();
};