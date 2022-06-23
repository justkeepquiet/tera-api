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
	sequelize.define("shop_accounts", {
		accountDBID: {
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		balance: {
			type: DataTypes.INTEGER
		},
		active: {
			type: DataTypes.TINYINT(4)
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		}
	})
;