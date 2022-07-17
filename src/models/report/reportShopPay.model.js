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
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true
		},
		accountDBID: {
			type: DataTypes.BIGINT
		},
		serverId: {
			type: DataTypes.INTEGER
		},
		ip: {
			type: DataTypes.STRING(64)
		},
		boxId: {
			type: DataTypes.INTEGER
		},
		productId: {
			type: DataTypes.STRING(255)
		},
		price: {
			type: DataTypes.INTEGER
		},
		status: {
			type: DataTypes.STRING(16)
		},
		createdAt: {
			type: DataTypes.DATE
		},
		updatedAt: {
			type: DataTypes.DATE
		}
	})
;