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
	sequelize.define("data_item_conversions", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			unique: "id"
		},
		itemTemplateId: {
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		fixedItemTemplateId: {
			type: DataTypes.BIGINT,
			primaryKey: true
		},
		class: {
			type: DataTypes.STRING(50)
		},
		race: {
			type: DataTypes.STRING(50)
		},
		gender: {
			type: DataTypes.STRING(50)
		}
	})
;