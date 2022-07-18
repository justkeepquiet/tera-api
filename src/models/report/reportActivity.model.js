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
	sequelize.define("report_activity", {
		accountDBID: {
			type: DataTypes.BIGINT(20),
			primaryKey: true
		},
		serverId: {
			type: DataTypes.INTEGER(11),
			primaryKey: true
		},
		ip: {
			type: DataTypes.STRING(64)
		},
		playTime: {
			type: DataTypes.INTEGER(11)
		},
		reportType: {
			type: DataTypes.INTEGER(11)
		},
		reportTime: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	})
;