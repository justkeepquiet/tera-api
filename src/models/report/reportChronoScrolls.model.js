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
			type: DataTypes.TIME
		}
	})
;