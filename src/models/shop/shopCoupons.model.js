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
	sequelize.define("shop_coupons", {
		couponId: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		coupon: {
			type: DataTypes.STRING(255),
			unique: "coupon",
			allowNull: false
		},
		discount: {
			type: DataTypes.INTEGER(11),
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
		},
		currentActivations: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		maxActivations: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		}
	}, {
		indexes: [
			{
				name: "coupon",
				unique: true,
				fields: ["coupon"]
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
			},
			{
				name: "currentActivations",
				unique: false,
				fields: ["currentActivations"]
			},
			{
				name: "maxActivations",
				unique: false,
				fields: ["maxActivations"]
			}
		],
		timestamps: true
	})
;