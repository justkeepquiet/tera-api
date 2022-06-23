"use strict";

/**
* @typedef {import("sequelize").Sequelize} Sequelize
* @typedef {import("sequelize/types")} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("shop_pay_logs", {
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