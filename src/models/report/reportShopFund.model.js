"use strict";

/**
* @typedef {import("../report.model").Sequelize} Sequelize
* @typedef {import("../report.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("report_shop_fund", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			allowNull: false
		},
		amount: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		balance: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(255)
		}
	}, {
		indexes: [
			{
				name: "accountDBID",
				unique: false,
				fields: ["accountDBID"]
			}
		],
		timestamps: true,
		updatedAt: false
	})
;