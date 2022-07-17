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
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		startTime: {
			type: DataTypes.DATE
		},
		endTime: {
			type: DataTypes.DATE
		},
		ip: {
			type: DataTypes.TEXT
		},
		description: {
			type: DataTypes.STRING
		},
		active: {
			type: DataTypes.TINYINT(4)
		}
	})
;