"use strict";

/**
* @typedef {import("../shop.model").Sequelize} Sequelize
* @typedef {import("../shop.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("shop_accounts", {
		accountDBID: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			allowNull: false
		},
		balance: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		discount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	}, {
		indexes: [
			{
				name: "active",
				unique: false,
				fields: ["active"]
			}
		],
		timestamps: true
	})
;