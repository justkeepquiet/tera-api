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
	sequelize.define("report_shop_fund", {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		accountDBID: {
			type: DataTypes.INTEGER
		},
		amount: {
			type: DataTypes.INTEGER
		},
		description: {
			type: DataTypes.STRING(255)
		},
		createdAt: {
			type: DataTypes.DATE
		}
	})
;