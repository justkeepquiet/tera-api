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
	sequelize.define("server_info", {
		serverId: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			allowNull: false
		},
		loginIp: {
			type: DataTypes.STRING(64)
		},
		loginPort: {
			type: DataTypes.INTEGER(11)
		},
		language: {
			type: DataTypes.STRING(3)
		},
		nameString: {
			type: DataTypes.STRING(256)
		},
		descrString: {
			type: DataTypes.STRING(1024)
		},
		permission: {
			type: DataTypes.INTEGER(11),
			defaultValue: 0
		},
		thresholdLow: {
			type: DataTypes.INTEGER(11)
		},
		thresholdMedium: {
			type: DataTypes.INTEGER(11)
		},
		isPvE: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		isCrowdness: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		isAvailable: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		isEnabled: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		usersOnline: {
			type: DataTypes.INTEGER(11),
			defaultValue: 0
		},
		usersTotal: {
			type: DataTypes.INTEGER(11),
			defaultValue: 0
		}
	})
;