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
	sequelize.define("shop_coupon_activated", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		couponId: {
			type: DataTypes.INTEGER(11),
			unique: "unique",
			allowNull: false
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			unique: "unique",
			allowNull: false
		},
		logId: {
			type: DataTypes.BIGINT(20),
			allowNull: false
		}
	}, {
		indexes: [
			{
				name: "unique",
				unique: true,
				fields: ["couponId", "accountDBID"]
			}
		],
		timestamps: true,
		updatedAt: false
	})
;