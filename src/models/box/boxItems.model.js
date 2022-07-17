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
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		boxId: {
			type: DataTypes.INTEGER,
			unique: "unique"
		},
		itemTemplateId: {
			type: DataTypes.BIGINT,
			unique: "unique"
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