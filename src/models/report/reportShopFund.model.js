"use strict";

/**
* @typedef {import("../report.model").Sequelize} Sequelize
* @typedef {import("../report.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("report_shop_fund", {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		accountDBID: {
			type: DataTypes.BIGINT
		},
		amount: {
			type: DataTypes.INTEGER
		},
		description: {
			type: DataTypes.STRING(255)
		},
		createdAt: {
			type: DataTypes.DATE
		}
	})
;