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
	sequelize.define("shop_products", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		icon: {
			type: DataTypes.STRING(255)
		},
		rareGrade: {
			type: DataTypes.INTEGER(11)
		},
		tag: {
			type: DataTypes.INTEGER(11)
		},
		validAfter: {
			type: DataTypes.DATE,
			allowNull: false
		},
		validBefore: {
			type: DataTypes.DATE,
			allowNull: false
		},
		sort: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		discount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		discountValidAfter: {
			type: DataTypes.DATE,
			allowNull: false
		},
		discountValidBefore: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		indexes: [
			{
				name: "categoryId",
				unique: false,
				fields: ["categoryId"]
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