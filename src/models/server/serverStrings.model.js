"use strict";

/**
* @typedef {import("../server.model").Sequelize} Sequelize
* @typedef {import("../server.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("server_strings", {
		language: {
			type: DataTypes.STRING(3),
			primaryKey: true,
			allowNull: false
		},
		categoryPvE: {
			type: DataTypes.STRING(50)
		},
		categoryPvP: {
			type: DataTypes.STRING(50)
		},
		serverOffline: {
			type: DataTypes.STRING(50)
		},
		serverLow: {
			type: DataTypes.STRING(50)
		},
		serverMedium: {
			type: DataTypes.STRING(50)
		},
		serverHigh: {
			type: DataTypes.STRING(50)
		},
		crowdNo: {
			type: DataTypes.STRING(50)
		},
		crowdYes: {
			type: DataTypes.STRING(50)
		},
		popup: {
			type: DataTypes.STRING(2048)
		}
	})
;