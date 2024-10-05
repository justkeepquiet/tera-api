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
		const transaction = await queryInterface.sequelize.transaction();

		try {
			// `account_info`
			await queryInterface.changeColumn("account_info", "language", {
				type: Sequelize.DataTypes.STRING(5)
			}, { transaction });
			await queryInterface.sequelize.query("ALTER TABLE `account_info` DROP PRIMARY KEY, ADD PRIMARY KEY (`accountDBID`)", { transaction });
			await queryInterface.addIndex("account_info", ["userName"], {
				unique: true,
				name: "userName",
				transaction
			});
			await queryInterface.addIndex("account_info", ["email"], {
				unique: true,
				name: "email",
				transaction
			});
			await queryInterface.removeIndex("account_info", "authKey", { transaction });
			await queryInterface.addIndex("account_info", ["authKey"], {
				unique: true,
				name: "authKey",
				transaction
			});

			// `shop_promocode_strings`
			await queryInterface.sequelize.query("ALTER TABLE `shop_promocode_strings` DROP PRIMARY KEY, DROP INDEX `id`, ADD PRIMARY KEY (`id`)", { transaction });
			await queryInterface.addIndex("shop_promocode_strings", ["language", "promoCodeId"], {
				unique: true,
				name: "unique",
				transaction
			});

			// `shop_category_strings`
			await queryInterface.sequelize.query("ALTER TABLE `shop_category_strings` DROP PRIMARY KEY, DROP INDEX `id`, ADD PRIMARY KEY (`id`)", { transaction });
			await queryInterface.addIndex("shop_category_strings", ["language", "categoryId"], {
				unique: true,
				name: "unique",
				transaction
			});

			// `server_info`
			await queryInterface.renameColumn("server_info", "tresholdLow", "thresholdLow", { transaction });
			await queryInterface.renameColumn("server_info", "tresholdMedium", "thresholdMedium", { transaction });

			// `report_activity`
			await queryInterface.addColumn("report_activity", "id", {
				type: Sequelize.DataTypes.BIGINT(20),
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				first: true
			}, { transaction });

			// `report_characters`
			await queryInterface.addColumn("report_characters", "id", {
				type: Sequelize.DataTypes.BIGINT(20),
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				first: true
			}, { transaction });

			// `report_cheats`
			await queryInterface.addColumn("report_cheats", "id", {
				type: Sequelize.DataTypes.BIGINT(20),
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				first: true
			}, { transaction });

			// `report_chronoscrolls`
			await queryInterface.addColumn("report_chronoscrolls", "id", {
				type: Sequelize.DataTypes.BIGINT(20),
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				first: true
			}, { transaction });

			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	},

	/**
	 * @param {QueryInterface} queryInterface
	 * @param {Sequelize} Sequelize
	 */
	down: async (queryInterface, Sequelize) => {
		const transaction = await queryInterface.sequelize.transaction();

		try {
			// `account_info`
			await queryInterface.changeColumn("account_info", "language", {
				type: Sequelize.DataTypes.STRING(3)
			}, { transaction });
			await queryInterface.removeIndex("account_info", "userName", { transaction });
			await queryInterface.removeIndex("account_info", "email", { transaction });
			await queryInterface.sequelize.query("ALTER TABLE `account_info` DROP PRIMARY KEY, ADD PRIMARY KEY (`accountDBID`, `userName`)", { transaction });
			await queryInterface.addIndex("account_info", ["authKey"], {
				unique: false,
				name: "authKey",
				transaction
			});

			// `shop_promocode_strings`
			await queryInterface.removeIndex("shop_promocode_strings", "unique", { transaction });
			await queryInterface.sequelize.query("ALTER TABLE `shop_promocode_strings` DROP PRIMARY KEY, DROP INDEX `id`, ADD PRIMARY KEY (`language`, `promoCodeId`)", { transaction });
			await queryInterface.addIndex("shop_promocode_strings", ["id"], {
				unique: true,
				name: "id",
				transaction
			});

			// `shop_category_strings`
			await queryInterface.removeIndex("shop_category_strings", "unique", { transaction });
			await queryInterface.sequelize.query("ALTER TABLE `shop_category_strings` DROP PRIMARY KEY, DROP INDEX `id`, ADD PRIMARY KEY (`language`, `categoryId`)", { transaction });
			await queryInterface.addIndex("shop_category_strings", ["id"], {
				unique: true,
				name: "id",
				transaction
			});

			// `server_info`
			await queryInterface.renameColumn("server_info", "thresholdLow", "tresholdLow", { transaction });
			await queryInterface.renameColumn("server_info", "thresholdMedium", "tresholdMedium", { transaction });

			// `report_activity`
			await queryInterface.removeColumn("report_activity", "id", { transaction });

			// `report_characters`
			await queryInterface.removeColumn("report_characters", "id", { transaction });

			// `report_cheats`
			await queryInterface.removeColumn("report_cheats", "id", { transaction });

			// `report_chronoscrolls`
			await queryInterface.removeColumn("report_chronoscrolls", "id", { transaction });

			await transaction.commit();
		} catch (err) {
			await transaction.rollback();
			throw err;
		}
	}
};