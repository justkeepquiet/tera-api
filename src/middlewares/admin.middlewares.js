"use strict";

/**
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("../models/report.model").reportModel} reportModel
 */

/**
 * @param {Response} res
 */
const resultJson = (res, code, params = {}) => res.json({
	result_code: code, ...params
});

/**
 * @type {RequestHandler}
 */
module.exports.accessFunctionHandler = (req, res, next) => {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;

		if (req.user.type === "steer" &&
			!Object.values(req.user.functions).includes(req.path)
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
 * @param {reportModel} reportModel
 */
module.exports.writeOperationReport = (reportModel, params = {}) =>
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		reportModel.adminOp.create({
			userSn: req?.user?.userSn,
			userId: req?.user?.login,
			userType: req?.user?.type,
			userTz: req?.user?.tz,
			ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
			function: req.path,
			payload: JSON.stringify([req.query, req.body]),
			reportType: params.reportType || 1
		}).catch(err => {
			reportModel.logger.error(err);
		});

		next();
	}
;

module.exports.resultJson = resultJson;