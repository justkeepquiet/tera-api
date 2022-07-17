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
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		serverId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		ip: {
			type: DataTypes.STRING(64)
		},
		type: {
			type: DataTypes.INTEGER
		},
		cheatInfo: {
			type: DataTypes.STRING(1024)
		},
		reportTime: {
			type: DataTypes.DATE
		}
	})
;