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
	sequelize.define("shop_slides", {
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		priority: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
		},
		productId: {
			type: DataTypes.BIGINT(20),
			allowNull: false
		},
		image: {
			type: DataTypes.STRING(2048),
			allowNull: false
		},
		displayDateStart: {
			type: DataTypes.DATE
		},
		displayDateEnd: {
			type: DataTypes.DATE
		}
	}, {
		indexes: [
			{
				name: "active",
				unique: false,
				fields: ["active"]
			},
			{
				name: "displayDateStart",
				unique: false,
				fields: ["displayDateStart"]
			},
			{
				name: "displayDateEnd",
				unique: false,
				fields: ["displayDateEnd"]
			}
		],
		timestamps: true
	})
;