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
			type: DataTypes.STRING(64)
		},
		description: {
			type: DataTypes.STRING
		},
		active: {
			type: DataTypes.TINYINT(4)
		}
	})
;