"use strict";

/**
 * @typedef {import("sequelize")} Sequelize
 * @typedef {import("sequelize").QueryInterface} QueryInterface
 */

module.exports = {
	VERSION: 3,

	/**
	 * @param {QueryInterface} queryInterface
	 * @param {Sequelize} Sequelize
	 */
	up: async (queryInterface, Sequelize) => {
		// `account_bans`
		await queryInterface.removeConstraint("account_bans", "PRIMARY");
		await queryInterface.addColumn("account_bans", "id", {
			type: Sequelize.DataTypes.BIGINT(20),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			first: true
		});
		await queryInterface.addIndex("account_bans", ["accountDBID"], {
			unique: false,
			name: "accountDBID"
		});

		// `account_info`
		await queryInterface.sequelize.query("ALTER TABLE `account_info` DROP PRIMARY KEY, ADD PRIMARY KEY (`accountDBID`)");
		await queryInterface.addIndex("account_info", ["userName"], {
			unique: true,
			name: "userName"
		});
		await queryInterface.addIndex("account_info", ["email"], {
			unique: true,
			name: "email"
		});
		await queryInterface.removeIndex("account_info", "authKey");
		await queryInterface.addIndex("account_info", ["authKey"], {
			unique: true,
			name: "authKey"
		});

		// `shop_accounts`
		await queryInterface.addColumn("shop_accounts", "balance", {
			type: Sequelize.DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0,
			after: "active"
		});

		// `shop_products`
		await queryInterface.addColumn("shop_products", "tag", {
			type: Sequelize.DataTypes.INTEGER(11),
			after: "rareGrade"
		});
		await queryInterface.addColumn("shop_products", "tagValidAfter", {
			type: Sequelize.DataTypes.DATE,
			after: "tag"
		});
		await queryInterface.addColumn("shop_products", "tagValidBefore", {
			type: Sequelize.DataTypes.DATE,
			after: "tagValidAfter"
		});
		await queryInterface.addColumn("shop_products", "discount", {
			type: Sequelize.DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0,
			after: "active"
		});
		await queryInterface.addColumn("shop_products", "discountValidAfter", {
			type: Sequelize.DataTypes.DATE,
			after: "discount"
		});
		await queryInterface.addColumn("shop_products", "discountValidBefore", {
			type: Sequelize.DataTypes.DATE,
			after: "discountValidAfter"
		});

		// `shop_promocode_strings`
		await queryInterface.sequelize.query("ALTER TABLE `shop_promocode_strings` DROP PRIMARY KEY, DROP INDEX `id`, ADD PRIMARY KEY (`id`)");
		await queryInterface.addIndex("shop_promocode_strings", ["language", "promoCodeId"], {
			unique: true,
			name: "unique"
		});

		// `shop_category_strings`
		await queryInterface.sequelize.query("ALTER TABLE `shop_category_strings` DROP PRIMARY KEY, DROP INDEX `id`, ADD PRIMARY KEY (`id`)");
		await queryInterface.addIndex("shop_category_strings", ["language", "categoryId"], {
			unique: true,
			name: "unique"
		});

		// `server_info`
		await queryInterface.renameColumn("server_info", "tresholdLow", "thresholdLow");
		await queryInterface.renameColumn("server_info", "tresholdMedium", "thresholdMedium");

		// `report_activity`
		await queryInterface.addColumn("report_activity", "id", {
			type: Sequelize.DataTypes.BIGINT(20),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			first: true
		});

		// `report_characters`
		await queryInterface.addColumn("report_characters", "id", {
			type: Sequelize.DataTypes.BIGINT(20),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			first: true
		});

		// `report_cheats`
		await queryInterface.addColumn("report_cheats", "id", {
			type: Sequelize.DataTypes.BIGINT(20),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			first: true
		});

		// `report_chronoscrolls`
		await queryInterface.addColumn("report_chronoscrolls", "id", {
			type: Sequelize.DataTypes.BIGINT(20),
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			first: true
		});

		// `report_shop_fund`
		await queryInterface.addColumn("report_shop_fund", "balance", {
			type: Sequelize.DataTypes.INTEGER(11),
			allowNull: false,
			after: "amount"
		});

		// `report_shop_pay`
		await queryInterface.addColumn("report_shop_pay", "quantity", {
			type: Sequelize.DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 1
		});

		// `shop_accounts`
		await queryInterface.removeColumn("shop_accounts", "discount");

		// `shop_products`
		await queryInterface.removeColumn("shop_products", "discountValidBefore");
		await queryInterface.removeColumn("shop_products", "discountValidAfter");
		await queryInterface.removeColumn("shop_products", "discount");
		await queryInterface.removeColumn("shop_products", "tagValidBefore");
		await queryInterface.removeColumn("shop_products", "tagValidAfter");
		await queryInterface.removeColumn("shop_products", "tag");

		// `shop_promocodes`
		await queryInterface.addColumn("shop_promocodes", "currentActivations", {
			type: Sequelize.DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0,
			after: "active"
		});
		await queryInterface.addColumn("shop_promocodes", "maxActivations", {
			type: Sequelize.DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0,
			after: "currentActivations"
		});
		await queryInterface.addIndex("shop_promocodes", ["currentActivations"], {
			unique: false,
			name: "currentActivations"
		});
		await queryInterface.addIndex("shop_promocodes", ["maxActivations"], {
			unique: false,
			name: "maxActivations"
		});
	},

	/**
	 * @param {QueryInterface} queryInterface
	 * @param {Sequelize} Sequelize
	 */
	down: async (queryInterface, Sequelize) => {
		// `account_bans`
		await queryInterface.sequelize.query("ALTER TABLE `account_bans` DROP COLUMN `id`, DROP PRIMARY KEY, DROP INDEX `accountDBID`, ADD PRIMARY KEY (`accountDBID`)");

		// `account_info`
		await queryInterface.sequelize.query("ALTER TABLE `account_info` DROP PRIMARY KEY, DROP INDEX `userName`, ADD PRIMARY KEY (`accountDBID`, `userName`)");
		await queryInterface.removeIndex("account_info", "email");
		await queryInterface.removeIndex("account_info", "authKey");
		await queryInterface.addIndex("account_info", ["authKey"], {
			unique: false,
			name: "authKey"
		});

		// `shop_promocode_strings`
		await queryInterface.removeIndex("shop_promocode_strings", "unique");
		await queryInterface.sequelize.query("ALTER TABLE `shop_promocode_strings` DROP PRIMARY KEY, ADD UNIQUE INDEX `id` (`id`), ADD PRIMARY KEY (`language`, `promoCodeId`)");

		// `shop_category_strings`
		await queryInterface.removeIndex("shop_category_strings", "unique");
		await queryInterface.sequelize.query("ALTER TABLE `shop_category_strings` DROP PRIMARY KEY, ADD UNIQUE INDEX `id` (`id`), ADD PRIMARY KEY (`language`, `categoryId`)");

		// `server_info`
		await queryInterface.renameColumn("server_info", "thresholdLow", "tresholdLow");
		await queryInterface.renameColumn("server_info", "thresholdMedium", "tresholdMedium");

		// `report_activity`
		await queryInterface.removeColumn("report_activity", "id");

		// `report_characters`
		await queryInterface.removeColumn("report_characters", "id");

		// `report_cheats`
		await queryInterface.removeColumn("report_cheats", "id");

		// `report_chronoscrolls`
		await queryInterface.removeColumn("report_chronoscrolls", "id");

		// `report_shop_fund`
		await queryInterface.removeColumn("report_shop_fund", "balance");

		// `report_shop_pay`
		await queryInterface.removeColumn("report_shop_pay", "quantity");

		// `shop_promocodes`
		await queryInterface.removeIndex("shop_promocodes", "currentActivations");
		await queryInterface.removeIndex("shop_promocodes", "maxActivations");
		await queryInterface.removeColumn("shop_promocodes", "currentActivations");
		await queryInterface.removeColumn("shop_promocodes", "maxActivations");
	}
};