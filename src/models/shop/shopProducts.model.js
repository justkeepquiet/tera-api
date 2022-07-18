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
			type: DataTypes.TEXT(255)
		},
		rareGrade: {
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
			type: DataTypes.TINYINT(4),
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