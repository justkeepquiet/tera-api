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
	sequelize.define("report_cheats", {
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
		type: {
			type: DataTypes.INTEGER(11)
		},
		cheatInfo: {
			type: DataTypes.STRING(1024)
		},
		reportTime: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	})
;