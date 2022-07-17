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
	sequelize.define("report_admin_op", {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		userId: {
			type: DataTypes.STRING(64)
		},
		userType: {
			type: DataTypes.STRING(64)
		},
		userSn: {
			type: DataTypes.BIGINT
		},
		userTz: {
			type: DataTypes.STRING(128)
		},
		ip: {
			type: DataTypes.STRING(64)
		},
		function: {
			type: DataTypes.STRING(256)
		},
		payload: {
			type: DataTypes.TEXT
		},
		reportType: {
			type: DataTypes.INTEGER
		},
		reportTime: {
			type: DataTypes.DATE
		}
	})
;