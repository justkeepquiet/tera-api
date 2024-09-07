"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const Op = require("sequelize").Op;
const moment = require("moment-timezone");

/**
 * @param {modules} modules
 */
module.exports.opAccountVerifyModel = async ({ accountModel }) => {
	await accountModel.verify.destroy({
		where: {
			createdAt: { [Op.lt]: moment().subtract(1, "hours").toDate() }
		}
	});
};

/**
 * @param {modules} modules
 */
module.exports.opAccountResetPasswordModel = async ({ accountModel }) => {
	await accountModel.resetPassword.destroy({
		where: {
			createdAt: { [Op.lt]: moment().subtract(1, "hours").toDate() }
		}
	});
};