"use strict";

// CHANGES MADE ARE APPLIED ONLY AFTER THE PROCESS IS RESTARTED.

const expr = require("../src/lib/scheduler").expr;

module.exports.portalApi = [
	{
		name: "opAccountVerifyModel",
		schedule: expr.EVERY_FIVE_MINUTES
	},
	{
		name: "opAccountResetPasswordModel",
		schedule: expr.EVERY_FIVE_MINUTES
	}
];