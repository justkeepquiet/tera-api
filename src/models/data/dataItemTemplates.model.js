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
	sequelize.define("data_item_templates", {
		itemTemplateId: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			allowNull: false
		},
		icon: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		rareGrade: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		category: {
			type: DataTypes.STRING(255)
		},
		requiredLevel: {
			type: DataTypes.INTEGER(11)
		},
		requiredClass: {
			type: DataTypes.STRING(255)
		},
		requiredGender: {
			type: DataTypes.STRING(255)
		},
		requiredRace: {
			type: DataTypes.STRING(255)
		},
		tradable: {
			type: DataTypes.TINYINT(4)
		},
		boundType: {
			type: DataTypes.STRING(255)
		},
		periodByWebAdmin: {
			type: DataTypes.TINYINT(4)
		},
		periodInMinute: {
			type: DataTypes.INTEGER(11)
		},
		warehouseStorable: {
			type: DataTypes.TINYINT(4)
		},
		linkSkillId: {
			type: DataTypes.BIGINT(20)
		},
		linkSkillPeriodDay: {
			type: DataTypes.INTEGER(11)
		}
	}, {
		indexes: [
			{
				name: "linkSkillId",
				unique: false,
				fields: ["linkSkillId"]
			}
		]
	})
;