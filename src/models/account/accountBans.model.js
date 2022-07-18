"use strict";

/**
* @typedef {import("../account.model").Sequelize} Sequelize
* @typedef {import("../account.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("account_bans", {
		accountDBID: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			allowNull: false
		},
		startTime: {
			type: DataTypes.DATE,
			allowNull: false
		},
		endTime: {
			type: DataTypes.DATE,
			allowNull: false
		},
		ip: {
			type: DataTypes.TEXT
		},
		description: {
			type: DataTypes.STRING
		},
		active: {
			type: DataTypes.TINYINT(4),
			allowNull: false,
			defaultValue: 1
		}
	})
;