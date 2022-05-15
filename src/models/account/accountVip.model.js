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
	sequelize.define("account_vip", {
		orderId: {
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		accountDBID: {
			type: DataTypes.BIGINT
		},
		vipExp: {
			type: DataTypes.INTEGER
		},
		insertTime: {
			type: DataTypes.TIME
		}
	})
;