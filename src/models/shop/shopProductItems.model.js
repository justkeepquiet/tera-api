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
	sequelize.define("shop_product_items", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		productId: {
			type: DataTypes.BIGINT(20),
			unique: "unique",
			allowNull: false
		},
		itemTemplateId: {
			type: DataTypes.BIGINT(20),
			unique: "unique",
			allowNull: false
		},
		boxItemId: {
			type: DataTypes.INTEGER(11)
		},
		boxItemCount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
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