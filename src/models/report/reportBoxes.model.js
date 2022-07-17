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
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		accountDBID: {
			type: DataTypes.BIGINT
		},
		serverId: {
			type: DataTypes.INTEGER
		},
		characterId: {
			type: DataTypes.INTEGER
		},
		logId: {
			type: DataTypes.INTEGER
		},
		context: {
			type: DataTypes.TEXT
		},
		createdAt: {
			type: DataTypes.DATE
		}
	})
;