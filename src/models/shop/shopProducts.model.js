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
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		categoryId: {
			type: DataTypes.INTEGER
		},
		price: {
			type: DataTypes.INTEGER
		},
		icon: {
			type: DataTypes.TEXT(255)
		},
		rareGrade: {
			type: DataTypes.INTEGER
		},
		validAfter: {
			type: DataTypes.DATE
		},
		validBefore: {
			type: DataTypes.DATE
		},
		sort: {
			type: DataTypes.INTEGER
		},
		active: {
			type: DataTypes.TINYINT(4)
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		}
	})
;