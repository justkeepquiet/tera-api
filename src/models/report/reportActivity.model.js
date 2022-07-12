"use strict";

/**
* @typedef {import("sequelize").Sequelize} Sequelize
* @typedef {import("sequelize/types")} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("report_activity", {
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
		playTime: {
			type: DataTypes.INTEGER
		},
		reportType: {
			type: DataTypes.INTEGER
		},
		reportTime: {
			type: DataTypes.DATE
		}
	})
;