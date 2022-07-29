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
		language: {
			type: DataTypes.STRING(3),
			primaryKey: true,
			allowNull: false
		},
		itemTemplateId: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			allowNull: false
		},
		string: {
			type: DataTypes.STRING(2048)
		},
		toolTip: {
			type: DataTypes.STRING(4096)
		}
	})
;