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
 * @property {import("sequelize").ModelCtor<Model<any, any>>} chronoScrolls
 * @property {import("sequelize").ModelCtor<Model<any, any>>} shopFund
 * @property {import("sequelize").ModelCtor<Model<any, any>>} shopPay
 * @property {import("sequelize").ModelCtor<Model<any, any>>} adminOp
 * @property {import("sequelize").ModelCtor<Model<any, any>>} boxes
 */

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 * @param {modules} modules
 */
module.exports = (sequelize, DataTypes, modules) => {
	const model = {
		activity: require("./report/reportActivity.model")(sequelize, DataTypes),
		characters: require("./report/reportCharacters.model")(sequelize, DataTypes),
		cheats: require("./report/reportCheats.model")(sequelize, DataTypes),
		launcher: require("./report/reportLauncher.model")(sequelize, DataTypes),
		chronoScrolls: require("./report/reportChronoScrolls.model")(sequelize, DataTypes),
		shopFund: require("./report/reportShopFund.model")(sequelize, DataTypes),
		shopPay: require("./report/reportShopPay.model")(sequelize, DataTypes),
		adminOp: require("./report/reportAdminOp.model")(sequelize, DataTypes),
		boxes: require("./report/reportBoxes.model")(sequelize, DataTypes)
	};

	model.activity.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.characters.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.cheats.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.chronoScrolls.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.shopPay.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	model.boxes.hasOne(modules.serverModel.info, {
		foreignKey: "serverId",
		sourceKey: "serverId",
		as: "server"
	});

	return model;
};