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
	sequelize.define("shop_promocode_activated", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		promoCodeId: {
			type: DataTypes.INTEGER(11),
			unique: "unique",
			allowNull: false
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			unique: "unique",
			allowNull: false
		}
	}, {
		indexes: [
			{
				name: "unique",
				unique: true,
				fields: ["promoCodeId", "accountDBID"]
			}
		],
		timestamps: true,
		updatedAt: false
	})
;