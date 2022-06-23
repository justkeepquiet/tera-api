"use strict";

/**
* @typedef {import("sequelize").Sequelize} Sequelize
* @typedef {import("sequelize/types")} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("shop_product_items", {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		productId: {
			type: DataTypes.INTEGER
		},
		itemTemplateId: {
			type: DataTypes.BIGINT
		},
		boxItemId: {
			type: DataTypes.INTEGER
		},
		boxItemCount: {
			type: DataTypes.INTEGER
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		}
	})
;