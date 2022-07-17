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
	sequelize.define("report_chronoscrolls", {
		accountDBID: {
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		serverId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		chronoId: {
			type: DataTypes.INTEGER
		},
		reportTime: {
			type: DataTypes.DATE
		}
	})
;