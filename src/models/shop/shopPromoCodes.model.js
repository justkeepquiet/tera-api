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
	sequelize.define("shop_promocodes", {
		promoCodeId: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		promoCode: {
			type: DataTypes.STRING(255),
			unique: "promoCode",
			allowNull: false
		},
		function: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		validAfter: {
			type: DataTypes.DATE,
			allowNull: false
		},
		validBefore: {
			type: DataTypes.DATE,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		}
	}, {
		indexes: [
			{
				name: "promoCode",
				unique: true,
				fields: ["promoCode"]
			},
			{
				name: "validAfter",
				unique: false,
				fields: ["validAfter"]
			},
			{
				name: "validBefore",
				unique: false,
				fields: ["validBefore"]
			},
			{
				name: "active",
				unique: false,
				fields: ["active"]
			}
		],
		timestamps: true
	})
;