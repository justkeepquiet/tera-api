"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 * @typedef {import("../app").modules} modules
 *
 * @typedef {object} accountModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} info
 * @property {import("sequelize").ModelCtor<Model<any, any>>} bans
 * @property {import("sequelize").ModelCtor<Model<any, any>>} characters
 * @property {import("sequelize").ModelCtor<Model<any, any>>} benefits
 * @property {import("sequelize").ModelCtor<Model<any, any>>} online
 * @property {import("sequelize").ModelCtor<Model<any, any>>} verify
 * @property {import("sequelize").ModelCtor<Model<any, any>>} resetPassword
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @param {modules} modules
 */
module.exports = async (sequelize, DataTypes, syncTables, modules) => {
	const model = {
		info: require("./account/accountInfo.model")(sequelize, DataTypes),
		bans: require("./account/accountBans.model")(sequelize, DataTypes),
		characters: require("./account/accountCharacters.model")(sequelize, DataTypes),
		benefits: require("./account/accountBenefits.model")(sequelize, DataTypes),
		online: require("./account/accountOnline.model")(sequelize, DataTypes),
		verify: require("./account/accountVerify.model")(sequelize, DataTypes),
		resetPassword: require("./account/accountResetPassword.model")(sequelize, DataTypes)
	};

	if (syncTables) {
		await model.info.sync();
		await model.bans.sync();
		await model.characters.sync();
		await model.benefits.sync();
		await model.online.sync();
		await model.verify.sync();
		await model.resetPassword.sync();
	}

	// info
	model.info.hasOne(model.bans, {
		foreignKey: "accountDBID",
		as: "banned"
	});

	model.info.hasMany(model.characters, {
		foreignKey: "accountDBID",
		as: "character"
	});

	model.info.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "lastLoginServer",
		as: "server"
	});

	// online
	model.online.hasOne(model.info, {
		foreignKey: "accountDBID",
		as: "info"
	});

	model.online.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	// characters
	model.characters.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	return model;
};