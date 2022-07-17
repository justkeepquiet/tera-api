"use strict";

/**
* @typedef {import("../data.model").Sequelize} Sequelize
* @typedef {import("../data.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("data_item_strings", {
		id: {
			type: DataTypes.BIGINT,
			unique: "id",
			autoIncrement: true
		},
		language: {
			type: DataTypes.STRING(3),
			primaryKey: true
		},
		itemTemplateId: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		string: {
			type: DataTypes.STRING(2048)
		},
		toolTip: {
			type: DataTypes.STRING(4096)
		}
	})
;