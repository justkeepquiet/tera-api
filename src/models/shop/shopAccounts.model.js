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
			defaultValue: 0
		},
		active: {
			type: DataTypes.TINYINT(4),
			defaultValue: 1
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			onUpdate: DataTypes.NOW
		}
	})
;