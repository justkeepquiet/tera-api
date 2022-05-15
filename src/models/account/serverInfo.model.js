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
	sequelize.define("server_info", {
		serverId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		loginIp: {
			type: DataTypes.INTEGER
		},
		loginPort: {
			type: DataTypes.INTEGER
		},
		language: {
			type: DataTypes.STRING(3)
		},
		nameString: {
			type: DataTypes.STRING(256)
		},
		descrString: {
			type: DataTypes.STRING(1025)
		},
		tresholdLow: {
			type: DataTypes.INTEGER
		},
		tresholdMedium: {
			type: DataTypes.INTEGER
		},
		isPvE: {
			type: DataTypes.TINYINT
		},
		isCrowdness: {
			type: DataTypes.TINYINT
		},
		isAvailable: {
			type: DataTypes.TINYINT
		},
		isEnabled: {
			type: DataTypes.TINYINT
		},
		usersOnline: {
			type: DataTypes.INTEGER
		},
		usersTotal: {
			type: DataTypes.INTEGER
		}
	})
;