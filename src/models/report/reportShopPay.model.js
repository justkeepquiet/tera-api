"use strict";

/**
* @typedef {import("../report.model").Sequelize} Sequelize
* @typedef {import("../report.model").DataTypes} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("report_shop_pay", {
		id: {
			type: DataTypes.BIGINT(20),
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		accountDBID: {
			type: DataTypes.BIGINT(20),
			allowNull: false
		},
		serverId: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		ip: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		boxId: {
			type: DataTypes.INTEGER(11)
		},
		productId: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		status: {
			type: DataTypes.STRING(16),
			allowNull: false
		}
	}, {
		indexes: [
			{
				name: "accountDBID",
				unique: false,
				fields: ["accountDBID"]
			},
			{
				name: "serverId",
				unique: false,
				fields: ["serverId"]
			},
			{
				name: "status",
				unique: false,
				fields: ["status"]
			}
		],
		timestamps: true
	})
;