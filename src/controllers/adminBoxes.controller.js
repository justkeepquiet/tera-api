"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const moment = require("moment-timezone");
const Op = require("sequelize").Op;
const helpers = require("../utils/helpers");

const { accessFunctionHandler, shopStatusHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, logger, queue, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		try {
			const boxes = await shopModel.boxes.findAll();

			const boxesMap = new Map();

			if (boxes !== null) {
				shopModel.boxItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
				shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

				const promises = [];

				boxes.forEach(box => {
					boxesMap.set(box.get("id"), {
						title: box.get("title"),
						content: box.get("content"),
						icon: box.get("icon"),
						days: box.get("days"),
						items: null
					});

					promises.push(shopModel.boxItems.findAll({
						where: { boxId: box.get("id") },
						include: [{
							model: shopModel.itemTemplates,
							include: [{
								model: shopModel.itemStrings,
								where: {
									language: i18n.getLocale()
								},
								attributes: []
							}],
							attributes: []
						}],
						attributes: {
							include: [
								[shopModel.boxItems.sequelize.col("boxId"), "boxId"],
								[shopModel.boxItems.sequelize.col("boxItemCount"), "boxItemCount"],
								[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
								[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
								[shopModel.itemStrings.sequelize.col("string"), "string"],
								[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
							]
						},
						order: [
							["createdAt", "ASC"]
						]
					}));
				});

				const boxItemsAssoc = await Promise.all(promises);

				if (boxItemsAssoc !== null) {
					boxItemsAssoc.forEach(boxItem => {
						if (boxItem !== null) {
							const boxId = boxItem[0].get("boxId");

							if (boxesMap.get(boxId)) {
								boxesMap.get(boxId).items = boxItem;
							}
						}
					});
				}
			}

			res.render("adminBoxes", {
				layout: "adminLayout",
				boxes: boxesMap
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = ({ logger }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		try {
			res.render("adminBoxesAdd", {
				layout: "adminLayout",
				errors: null,
				title: "",
				content: "",
				icon: "GiftBox01.bmp",
				days: 3650,
				resolvedItems: [],
				itemTemplateIds: [""],
				boxItemIds: [""],
				boxItemCounts: ["1"],
				validate: 1
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, platform, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	[
		body("title").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Title must be between 1 and 1024 characters.")),
		body("content").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters.")),
		body("icon").optional().trim()
			.isLength({ max: 2048 }).withMessage(i18n.__("Icon must be between 1 and 255 characters.")),
		body("days").trim()
			.isInt({ min: 1 }).withMessage(i18n.__("Days field must contain the value as a number.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Item template ID field has invalid value."))
			.custom(value => shopModel.itemTemplates.findOne({
				where: {
					itemTemplateId: value
				}
			}).then(data => {
				if (value && !data) {
					return Promise.reject(`${i18n.__("A non-existent item has been added")}: ${value}`);
				}
			}))
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);

				return !itemTemplateIds.includes(value);
			})
			.withMessage(i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1 }).withMessage(i18n.__("Box item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(i18n.__("No items have been added to the box."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { validate, title, content, icon, days, itemTemplateIds, boxItemIds, boxItemCounts } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		try {
			const itemsPromises = [];
			const resolvedItems = {};

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
					shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

					itemsPromises.push(shopModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [{
							model: shopModel.itemStrings,
							where: {
								language: i18n.getLocale()
							},
							attributes: []
						}],
						attributes: {
							include: [
								[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
								[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
								[shopModel.itemStrings.sequelize.col("string"), "string"],
								[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
							]
						}
					}));
				});
			}

			const items = await Promise.all(itemsPromises);

			items.forEach(item => {
				if (item) {
					resolvedItems[item.get("itemTemplateId")] = item;
				}
			});

			if (!errors.isEmpty() || validate == 1) {
				return res.render("adminBoxesAdd", {
					layout: "adminLayout",
					errors: errors.array(),
					title,
					content,
					icon,
					days,
					resolvedItems,
					itemTemplateIds: itemTemplateIds || [],
					boxItemIds: boxItemIds || [],
					boxItemCounts: boxItemCounts || [],
					validate: Number(!errors.isEmpty())
				});
			}

			await shopModel.sequelize.transaction(async transaction => {
				const box = await shopModel.boxes.create({
					title,
					content,
					icon,
					days
				}, {
					transaction
				});

				const promises = [];

				if (itemTemplateIds) {
					itemTemplateIds.forEach((itemTemplateId, index) => {
						if (boxItemIds[index] === "" && resolvedItems[itemTemplateId]) {
							promises.push(platform.createServiceItem(
								req.user.userSn || 0,
								itemTemplateId,
								1,
								moment().utc().format("YYYY-MM-DD HH:mm:ss"),
								true,
								resolvedItems[itemTemplateId].get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("toolTip")),
								"1,1,1"
							).then(boxItemId =>
								shopModel.boxItems.create({
									boxId: box.get("id"),
									itemTemplateId,
									boxItemId,
									boxItemCount: boxItemCounts[index]
								}, {
									transaction
								})
							));
						} else {
							promises.push(shopModel.boxItems.create({
								boxId: box.get("id"),
								itemTemplateId,
								boxItemId: boxItemIds[index] || null,
								boxItemCount: boxItemCounts[index]
							}, {
								transaction
							}));
						}
					});
				}

				await Promise.all(promises);
			});

			next();
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/boxes");
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ i18n, logger, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { id } = req.query;

		try {
			const box = await shopModel.boxes.findOne({ where: { id } });

			if (box === null) {
				return res.redirect("/boxes");
			}

			shopModel.boxItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			const boxItems = await shopModel.boxItems.findAll({
				where: { boxId: box.get("id") },
				include: [{
					model: shopModel.itemTemplates,
					include: [{
						model: shopModel.itemStrings,
						where: { language: i18n.getLocale() },
						attributes: []
					}],
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.boxItems.sequelize.col("boxId"), "boxId"],
						[shopModel.boxItems.sequelize.col("boxItemCount"), "boxItemCount"],
						[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
						[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
						[shopModel.itemStrings.sequelize.col("string"), "string"],
						[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
					]
				},
				order: [
					["createdAt", "ASC"]
				]
			});

			const itemTemplateIds = [];
			const boxItemIds = [];
			const boxItemCounts = [];
			const promises = [];

			if (boxItems !== null) {
				boxItems.forEach(productItem => {
					itemTemplateIds.push(productItem.get("itemTemplateId"));
					boxItemIds.push(productItem.get("boxItemId"));
					boxItemCounts.push(productItem.get("boxItemCount"));
				});
			}

			itemTemplateIds.forEach(itemTemplateId => {
				shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
				shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

				promises.push(shopModel.itemTemplates.findOne({
					where: { itemTemplateId },
					include: [{
						model: shopModel.itemStrings,
						where: {
							language: i18n.getLocale()
						},
						attributes: []
					}],
					attributes: {
						include: [
							[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
							[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
							[shopModel.itemStrings.sequelize.col("string"), "string"],
							[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
						]
					}
				}));
			});

			const items = await Promise.all(promises);
			const resolvedItems = {};

			items.forEach(item => {
				if (item) {
					resolvedItems[item.get("itemTemplateId")] = item;
				}
			});

			res.render("adminBoxesEdit", {
				layout: "adminLayout",
				errors: null,
				id,
				title: box.get("title"),
				content: box.get("content"),
				icon: box.get("icon"),
				days: box.get("days"),
				resolvedItems,
				itemTemplateIds,
				boxItemIds,
				boxItemCounts,
				validate: 0
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, platform, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	[
		body("title").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Title must be between 1 and 1024 characters.")),
		body("content").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters.")),
		body("icon").optional().trim()
			.isLength({ max: 2048 }).withMessage(i18n.__("Icon must be between 1 and 255 characters.")),
		body("days").trim()
			.isInt({ min: 1 }).withMessage(i18n.__("Days field must contain the value as a number.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Item template ID field has invalid value."))
			.custom(value => shopModel.itemTemplates.findOne({
				where: {
					itemTemplateId: value
				}
			}).then(data => {
				if (value && !data) {
					return Promise.reject(`${i18n.__("A non-existent item has been added")}: ${value}`);
				}
			}))
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);

				return !itemTemplateIds.includes(value);
			})
			.withMessage(i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1 }).withMessage(i18n.__("Box item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(i18n.__("No items have been added to the box."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { validate, title, content, icon, days, itemTemplateIds, boxItemIds, boxItemCounts } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		try {
			if (!id) {
				return res.redirect("/boxes");
			}

			const box = await shopModel.boxes.findOne({ where: { id } });

			if (box === null) {
				return res.redirect("/boxes");
			}

			const itemsPromises = [];
			const resolvedItems = {};

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					shopModel.itemTemplates.belongsTo(shopModel.itemStrings, { foreignKey: "itemTemplateId" });
					shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

					itemsPromises.push(shopModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [{
							model: shopModel.itemStrings,
							where: {
								language: i18n.getLocale()
							},
							attributes: []
						}],
						attributes: {
							include: [
								[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
								[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
								[shopModel.itemStrings.sequelize.col("string"), "string"],
								[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
							]
						}
					}));
				});
			}

			const items = await Promise.all(itemsPromises);

			items.forEach(item => {
				if (item) {
					resolvedItems[item.get("itemTemplateId")] = item;
				}
			});

			if (!errors.isEmpty() || validate == 1) {
				return res.render("adminBoxesEdit", {
					layout: "adminLayout",
					errors: errors.array(),
					id: box.get("id"),
					title,
					content,
					icon,
					days,
					resolvedItems,
					itemTemplateIds: itemTemplateIds || [],
					boxItemIds: boxItemIds || [],
					boxItemCounts: boxItemCounts || [],
					validate: Number(!errors.isEmpty())
				});
			}

			const boxItems = await shopModel.boxItems.findAll({
				where: { boxId: box.get("id") }
			});

			await shopModel.sequelize.transaction(async transaction => {
				const promises = [
					shopModel.boxes.update({
						icon,
						title,
						content,
						days
					}, {
						where: { id: box.get("id") },
						transaction
					})
				];

				boxItems.forEach(productItem => {
					const itemTemplateId = productItem.get("itemTemplateId");
					const index = Object.keys(itemTemplateIds).find(k => itemTemplateIds[k] == itemTemplateId);

					if (itemTemplateIds[index]) {
						if (!boxItemIds[index]) {
							promises.push(platform.createServiceItem(
								req.user.userSn || 0,
								itemTemplateId,
								1,
								moment().utc().format("YYYY-MM-DD HH:mm:ss"),
								true,
								resolvedItems[itemTemplateId].get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("toolTip")),
								"1,1,1"
							).then(boxItemId =>
								shopModel.boxItems.update({
									boxItemId,
									boxItemCount: boxItemCounts[index] || 1
								}, {
									where: { id: productItem.get("id") },
									transaction
								})
							));
						} else {
							promises.push(shopModel.boxItems.update({
								boxItemId: boxItemIds[index] || null,
								boxItemCount: boxItemCounts[index] || 1
							}, {
								where: { id: productItem.get("id") },
								transaction
							}));
						}
					} else {
						if (productItem.get("boxItemId")) {
							promises.push(platform.removeServiceItem(productItem.get("boxItemId")));
						}

						promises.push(shopModel.boxItems.destroy({
							where: { id: productItem.get("id") },
							transaction
						}));
					}
				});

				if (itemTemplateIds) {
					itemTemplateIds.forEach((itemTemplateId, index) =>
						promises.push(shopModel.boxItems.findOne({
							where: {
								boxId: box.get("id"),
								itemTemplateId
							}
						}).then(async productItem => {
							if (productItem === null) {
								if (!boxItemIds[index]) {
									return platform.createServiceItem(
										req.user.userSn || 0,
										itemTemplateId,
										1,
										moment().utc().format("YYYY-MM-DD HH:mm:ss"),
										true,
										resolvedItems[itemTemplateId].get("string"),
										resolvedItems[itemTemplateId].get("toolTip"),
										"1,1,1"
									).then(boxItemId =>
										shopModel.boxItems.create({
											boxId: box.get("id"),
											itemTemplateId,
											boxItemId,
											boxItemCount: boxItemCounts[index] || 1
										}, {
											transaction
										})
									);
								} else {
									return shopModel.boxItems.create({
										boxId: box.get("id"),
										itemTemplateId,
										boxItemId: boxItemIds[index] || null,
										boxItemCount: boxItemCounts[index] || 1
									}, {
										transaction
									});
								}
							}
						}))
					);
				}

				await Promise.all(promises);
			});

			next();
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/boxes");
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, platform, reportModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		try {
			if (!id) {
				return res.redirect("/boxes");
			}

			const boxItems = await shopModel.boxItems.findAll({
				where: { boxId: id }
			});

			await shopModel.sequelize.transaction(async transaction => {
				const promises = [
					shopModel.boxes.destroy({
						where: { id },
						transaction
					})
				];

				if (boxItems !== null) {
					for (const productItem of boxItems) {
						if (productItem.get("boxItemId")) {
							if (productItem.get("boxItemId")) {
								promises.push(platform.removeServiceItem(productItem.get("boxItemId")));
							}

							promises.push(shopModel.boxItems.destroy({
								where: { id: productItem.get("id") },
								transaction
							}));
						} else {
							promises.push(shopModel.boxItems.destroy({
								where: { id: productItem.get("id") },
								transaction
							}));
						}
					}
				}

				await Promise.all(promises);
			});

			next();
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/boxes");
	}
];

/**
 * @param {modules} modules
 */
module.exports.send = ({ i18n, logger, platform, accountModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { id } = req.query;

		try {
			const box = await shopModel.boxes.findOne({ where: { id } });

			if (box === null) {
				return res.redirect("/boxes");
			}

			const servers = await accountModel.serverInfo.findAll();

			shopModel.boxItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			const items = await shopModel.boxItems.findAll({
				where: { boxId: box.get("id") },
				include: [{
					model: shopModel.itemTemplates,
					include: [{
						model: shopModel.itemStrings,
						where: { language: i18n.getLocale() },
						attributes: []
					}],
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.boxItems.sequelize.col("boxId"), "boxId"],
						[shopModel.boxItems.sequelize.col("boxItemCount"), "boxItemCount"],
						[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
						[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
						[shopModel.itemStrings.sequelize.col("string"), "string"],
						[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
					]
				},
				order: [
					["createdAt", "ASC"]
				]
			});

			const promises = [];
			const itemChecks = {};

			items.forEach(item =>
				promises.push(
					platform.getServiceItem(item.get("boxItemId")).then(resultSet => {
						if (resultSet.length > 0) {
							itemChecks[item.get("boxItemId")] = true;
						}
					})
				)
			);

			await Promise.all(promises);

			res.render("adminBoxesSend", {
				layout: "adminLayout",
				errors: null,
				servers,
				id,
				serverId: "",
				accountDBID: "",
				characterId: "",
				title: box.get("title"),
				content: box.get("content"),
				icon: box.get("icon"),
				days: box.get("days"),
				items,
				itemChecks
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendAction = ({ i18n, logger, queue, platform, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	expressLayouts,
	[
		body("serverId")
			.isInt().withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.serverInfo.findOne({
				where: {
					serverId: req.body.serverId
				}
			}).then(data => {
				if (data === null) {
					return Promise.reject(i18n.__("Server ID field contains not existing server ID."));
				}
			})),
		body("accountDBID")
			.isInt().withMessage(i18n.__("Account ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.info.findOne({
				where: {
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.accountDBID && data === null) {
					return Promise.reject(i18n.__("Account ID field contains not existing account ID."));
				}
			})),
		body("characterId").optional({ checkFalsy: true })
			.isInt({ min: 0 }).withMessage(i18n.__("Character ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.characters.findOne({
				where: {
					characterId: req.body.characterId,
					serverId: req.body.serverId,
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.characterId && data === null) {
					return Promise.reject(i18n.__("Character ID field contains not existing character ID."));
				}
			}))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { serverId, accountDBID, characterId } = req.body;
		const errors = helpers.validationResultLog(req, logger).array();

		try {
			const box = await shopModel.boxes.findOne({ where: { id } });

			if (box === null) {
				return res.redirect("/boxes");
			}

			const servers = await accountModel.serverInfo.findAll();

			shopModel.boxItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			const items = await shopModel.boxItems.findAll({
				where: { boxId: box.get("id") },
				include: [{
					model: shopModel.itemTemplates,
					include: [{
						model: shopModel.itemStrings,
						where: { language: i18n.getLocale() },
						attributes: []
					}],
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.boxItems.sequelize.col("boxId"), "boxId"],
						[shopModel.boxItems.sequelize.col("boxItemCount"), "boxItemCount"],
						[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
						[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
						[shopModel.itemStrings.sequelize.col("string"), "string"],
						[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
					]
				},
				order: [
					["createdAt", "ASC"]
				]
			});

			if (items === null) {
				return res.redirect("/boxes");
			}

			const promises = [];
			const itemChecks = {};

			items.forEach(item =>
				promises.push(
					platform.getServiceItem(item.get("boxItemId")).then(resultSet => {
						if (resultSet.length > 0) {
							itemChecks[item.get("boxItemId")] = true;
						}
					})
				)
			);

			await Promise.all(promises);

			if (items.length !== Object.keys(itemChecks).length) {
				errors.push({
					msg: i18n.__("There are no Service Items for the specified box item IDs.")
				});
			}

			if (errors.length > 0) {
				return res.render("adminBoxesSend", {
					layout: "adminLayout",
					errors,
					servers,
					id,
					serverId,
					accountDBID,
					characterId,
					title: box.get("title"),
					content: box.get("content"),
					icon: box.get("icon"),
					days: box.get("days"),
					items,
					itemChecks
				});
			}

			// Send to accountDBID via platform hub
			queue.insert("createBox", [
				{
					content: box.get("content"),
					title: box.get("title"),
					icon: box.get("icon"),
					items: items.map(item => ({
						item_id: item.get("boxItemId"),
						item_count: item.get("boxItemCount")
					}))
				},
				moment().utc().format("YYYY-MM-DD HH:mm:ss"),
				moment().utc().add(box.get("days"), "days").format("YYYY-MM-DD HH:mm:ss"),
				accountDBID,
				serverId,
				characterId || 0
			],
			box.get("id"));

			next();
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/boxes");
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendAll = ({ i18n, logger, platform, accountModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { id } = req.query;

		try {
			const box = await shopModel.boxes.findOne({ where: { id } });

			if (box === null) {
				return res.redirect("/boxes");
			}

			const servers = await accountModel.serverInfo.findAll();

			shopModel.boxItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			const items = await shopModel.boxItems.findAll({
				where: { boxId: box.get("id") },
				include: [{
					model: shopModel.itemTemplates,
					include: [{
						model: shopModel.itemStrings,
						where: { language: i18n.getLocale() },
						attributes: []
					}],
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.boxItems.sequelize.col("boxId"), "boxId"],
						[shopModel.boxItems.sequelize.col("boxItemCount"), "boxItemCount"],
						[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
						[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
						[shopModel.itemStrings.sequelize.col("string"), "string"],
						[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
					]
				},
				order: [
					["createdAt", "ASC"]
				]
			});

			const promises = [];
			const itemChecks = {};

			items.forEach(item =>
				promises.push(
					platform.getServiceItem(item.get("boxItemId")).then(resultSet => {
						if (resultSet.length > 0) {
							itemChecks[item.get("boxItemId")] = true;
						}
					})
				)
			);

			await Promise.all(promises);

			res.render("adminBoxesSendAll", {
				layout: "adminLayout",
				errors: null,
				servers,
				id,
				serverId: "",
				loginAfterTime: moment().subtract(30, "days"),
				title: box.get("title"),
				content: box.get("content"),
				icon: box.get("icon"),
				days: box.get("days"),
				items,
				itemChecks
			});
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendAllAction = ({ i18n, logger, queue, platform, reportModel, accountModel, shopModel }) => [
	accessFunctionHandler,
	shopStatusHandler,
	expressLayouts,
	expressLayouts,
	[
		body("serverId")
			.isInt().withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => accountModel.serverInfo.findOne({
				where: {
					serverId: req.body.serverId
				}
			}).then(data => {
				if (data === null) {
					return Promise.reject(i18n.__("Server ID field contains not existing server ID."));
				}
			})),
		body("loginAfterTime")
			.isISO8601().withMessage(i18n.__("Last login field must contain a valid date."))
	],
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { serverId, loginAfterTime } = req.body;
		const errors = helpers.validationResultLog(req, logger).array();

		try {
			const box = await shopModel.boxes.findOne({ where: { id } });

			if (box === null) {
				return res.redirect("/boxes");
			}

			const servers = await accountModel.serverInfo.findAll();

			const users = await accountModel.info.findAll({
				where: {
					lastLoginServer: serverId,
					lastLoginTime: {
						[Op.gt]: moment.tz(loginAfterTime, req.user.tz).toDate()
					}
				}
			});

			shopModel.boxItems.belongsTo(shopModel.itemTemplates, { foreignKey: "itemTemplateId" });
			shopModel.itemTemplates.hasOne(shopModel.itemStrings, { foreignKey: "itemTemplateId" });

			const items = await shopModel.boxItems.findAll({
				where: { boxId: box.get("id") },
				include: [{
					model: shopModel.itemTemplates,
					include: [{
						model: shopModel.itemStrings,
						where: { language: i18n.getLocale() },
						attributes: []
					}],
					attributes: []
				}],
				attributes: {
					include: [
						[shopModel.boxItems.sequelize.col("boxId"), "boxId"],
						[shopModel.boxItems.sequelize.col("boxItemCount"), "boxItemCount"],
						[shopModel.itemTemplates.sequelize.col("rareGrade"), "rareGrade"],
						[shopModel.itemTemplates.sequelize.col("icon"), "icon"],
						[shopModel.itemStrings.sequelize.col("string"), "string"],
						[shopModel.itemStrings.sequelize.col("toolTip"), "toolTip"]
					]
				},
				order: [
					["createdAt", "ASC"]
				]
			});

			if (items === null) {
				return res.redirect("/boxes");
			}

			const promises = [];
			const itemChecks = {};

			items.forEach(item =>
				promises.push(
					platform.getServiceItem(item.get("boxItemId")).then(resultSet => {
						if (resultSet.length > 0) {
							itemChecks[item.get("boxItemId")] = true;
						}
					})
				)
			);

			await Promise.all(promises);

			if (items.length !== Object.keys(itemChecks).length) {
				errors.push({
					msg: i18n.__("There are no Service Items for the specified box item IDs.")
				});
			}

			if (errors.length > 0) {
				return res.render("adminBoxesSendAll", {
					layout: "adminLayout",
					errors,
					servers,
					id,
					serverId,
					title: box.get("title"),
					content: box.get("content"),
					icon: box.get("icon"),
					days: box.get("days"),
					items,
					itemChecks
				});
			}

			// Send to all users via platform hub
			users.forEach(user =>
				queue.insert("createBox", [
					{
						content: box.get("content"),
						title: box.get("title"),
						icon: box.get("icon"),
						items: items.map(item => ({
							item_id: item.get("boxItemId"),
							item_count: item.get("boxItemCount")
						}))
					},
					moment().utc().format("YYYY-MM-DD HH:mm:ss"),
					moment().utc().add(box.get("days"), "days").format("YYYY-MM-DD HH:mm:ss"),
					user.get("accountDBID"),
					user.get("lastLoginServer")
				],
				box.get("id"))
			);

			next();
		} catch (err) {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		}
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/boxes");
	}
];