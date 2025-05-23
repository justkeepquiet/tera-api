"use strict";

/**
 * @typedef {import("../app").Sequelize} Sequelize
 * @typedef {import("../app").DataTypes} DataTypes
 * @typedef {import("../app").modules} modules
 *
 * @typedef {object} reportModel
 * @property {import("sequelize").ModelCtor<Model<any, any>>} activity
 * @property {import("sequelize").ModelCtor<Model<any, any>>} characters
 * @property {import("sequelize").ModelCtor<Model<any, any>>} cheats
 * @property {import("sequelize").ModelCtor<Model<any, any>>} launcher
 * @property {import("sequelize").ModelCtor<Model<any, any>>} chronoScrolls
 * @property {import("sequelize").ModelCtor<Model<any, any>>} shopFund
 * @property {import("sequelize").ModelCtor<Model<any, any>>} shopPay
 * @property {import("sequelize").ModelCtor<Model<any, any>>} adminOp
 * @property {import("sequelize").ModelCtor<Model<any, any>>} boxes
 * @property {import("sequelize").ModelCtor<Model<any, any>>} gateway
 * @property {import("sequelize").ModelCtor<Model<any, any>>} queueTasks
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @param {modules} modules
 */
module.exports = async (sequelize, DataTypes, syncTables, modules) => {
	const model = {
		activity: require("./report/reportActivity.model")(sequelize, DataTypes),
		characters: require("./report/reportCharacters.model")(sequelize, DataTypes),
		cheats: require("./report/reportCheats.model")(sequelize, DataTypes),
		launcher: require("./report/reportLauncher.model")(sequelize, DataTypes),
		chronoScrolls: require("./report/reportChronoScrolls.model")(sequelize, DataTypes),
		shopFund: require("./report/reportShopFund.model")(sequelize, DataTypes),
		shopPay: require("./report/reportShopPay.model")(sequelize, DataTypes),
		adminOp: require("./report/reportAdminOp.model")(sequelize, DataTypes),
		boxes: require("./report/reportBoxes.model")(sequelize, DataTypes),
		gateway: require("./report/reportGateway.model")(sequelize, DataTypes),
		queueTasks: require("./report/reportQueueTasks.model")(sequelize, DataTypes)
	};

	if (syncTables) {
		await model.activity.sync();
		await model.characters.sync();
		await model.cheats.sync();
		await model.launcher.sync();
		await model.chronoScrolls.sync();
		await model.shopFund.sync();
		await model.shopPay.sync();
		await model.adminOp.sync();
		await model.boxes.sync();
		await model.gateway.sync();
		await model.queueTasks.sync();
	}

	// activity
	model.activity.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.activity.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// characters
	model.characters.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.characters.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// cheats
	model.cheats.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.cheats.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// chronoScrolls
	model.chronoScrolls.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.chronoScrolls.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// boxes
	model.boxes.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.boxes.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// shopFund
	model.shopFund.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// shopPay
	model.shopPay.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.shopPay.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	// launcher
	model.launcher.hasOne(modules.accountModel.info, {
		foreignKey: "accountDBID",
		sourceKey: "accountDBID",
		as: "account"
	});

	return model;
};