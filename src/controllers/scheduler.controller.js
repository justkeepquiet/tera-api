"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const Op = require("sequelize").Op;

/**
 * @param {modules} modules
 */
module.exports.opAccountVerifyModel = async ({ sequelize, accountModel }) => {
	await accountModel.verify.destroy({
		where: {
			createdAt: { [Op.lt]: sequelize.literal("NOW() - INTERVAL 1 HOUR") }
		}
	});
};

/**
 * @param {modules} modules
 */
module.exports.opAccountResetPasswordModel = async ({ sequelize, accountModel }) => {
	await accountModel.resetPassword.destroy({
		where: {
			createdAt: { [Op.lt]: sequelize.literal("NOW() - INTERVAL 1 HOUR") }
		}
	});
};