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
	sequelize.define("report_boxes", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			allowNull: false
		},
		serverId: {
			type: DataTypes.INTEGER(11)
		},
		characterId: {
			type: DataTypes.INTEGER(11)
		},
		logId: {
			type: DataTypes.BIGINT(20)
		},
		context: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		}
	})
;