"use strict";

/**
* @typedef {import("../box.model").Sequelize} Sequelize
* @typedef {import("../box.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("box_items", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		boxId: {
			type: DataTypes.BIGINT(20),
			unique: "UNIQUE",
			allowNull: false
		},
		itemTemplateId: {
			type: DataTypes.BIGINT(20),
			unique: "UNIQUE",
			allowNull: false
		},
		boxItemId: {
			type: DataTypes.INTEGER(11)
		},
		boxItemCount: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 1
		}
	}, {
		indexes: [
			{
				name: "UNIQUE",
				unique: true,
				fields: ["boxId", "itemTemplateId"]
			}
		],
		timestamps: true
	})
;