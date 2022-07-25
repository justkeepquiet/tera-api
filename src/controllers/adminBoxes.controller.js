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

const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, logger, queue, boxModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		try {
			const boxes = new Map();
			const boxItems = [];
			const tasks = [];

			(await boxModel.info.findAll({
				include: [{
					as: "item",
					model: boxModel.items,
					include: [
						{
							as: "template",
							model: dataModel.itemTemplates
						},
						{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}
					],
					order: [
						["createdAt", "ASC"]
					]
				}],
				order: [
					["id", "DESC"]
				]
			})).forEach(box => {
				boxes.set(box.get("id"), {
					title: box.get("title"),
					content: box.get("content"),
					icon: box.get("icon"),
					days: box.get("days"),
					items: box.get("item"),
					processing: false
				});

				boxItems.push(queue.findByTag("createBox", box.get("id"), 1));
			});

			(await Promise.all(boxItems)).forEach(boxItem => {
				if (boxItem !== null && boxItem[0] !== undefined) {
					const boxId = boxItem[0].get("boxId");

					if (boxes.has(boxId)) {
						boxes.get(boxItem[0].get("boxId")).items = boxItem;
					}
				}
			});

			(await Promise.all(tasks)).forEach(task => {
				if (task !== null && task[0] !== undefined) {
					const boxId = Number(task[0].get("tag"));

					if (boxes.has(boxId)) {
						boxes.get(boxId).processing = true;
					}
				}
			});

			res.render("adminBoxes", {
				layout: "adminLayout",
				boxes
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
module.exports.addAction = ({ i18n, logger, hub, sequelize, reportModel, boxModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("title").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Title must be between 1 and 1024 characters.")),
		body("content").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters.")),
		body("icon").optional().trim()
			.isLength({ max: 2048 }).withMessage(i18n.__("Icon must be between 1 and 255 characters.")),
		body("days")
			.isInt({ min: 1, max: 4000 }).withMessage(i18n.__("Days field must contain the value as a number.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Item template ID field has invalid value."))
			.custom(value => dataModel.itemTemplates.findOne({
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
					itemsPromises.push(dataModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}]
					}));
				});
			}

			(await Promise.all(itemsPromises)).forEach(item => {
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

			await sequelize.transaction(async transaction => {
				const box = await boxModel.info.create({
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
							if (!resolvedItems[itemTemplateId]) return;

							promises.push(hub.createServiceItem(
								req.user.userSn || 0,
								itemTemplateId,
								1,
								moment().utc().format("YYYY-MM-DD HH:mm:ss"),
								true,
								resolvedItems[itemTemplateId].get("strings")[0]?.get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")[0]?.get("toolTip")),
								"1,1,1"
							).then(boxItemId =>
								boxModel.items.create({
									boxId: box.get("id"),
									itemTemplateId,
									boxItemId,
									boxItemCount: boxItemCounts[index]
								}, {
									transaction
								})
							));
						} else {
							promises.push(boxModel.items.create({
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
module.exports.edit = ({ i18n, logger, boxModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { id } = req.query;

		try {
			const box = await boxModel.info.findOne({
				where: { id },
				include: [{
					as: "item",
					model: boxModel.items,
					order: [
						["createdAt", "ASC"]
					]
				}]
			});

			if (box === null) {
				return res.redirect("/boxes");
			}

			const itemTemplateIds = [];
			const boxItemIds = [];
			const boxItemCounts = [];
			const resolvedItems = {};
			const promises = [];

			box.get("item").forEach(boxItem => {
				itemTemplateIds.push(boxItem.get("itemTemplateId"));
				boxItemIds.push(boxItem.get("boxItemId"));
				boxItemCounts.push(boxItem.get("boxItemCount"));
			});

			itemTemplateIds.forEach(itemTemplateId => {
				promises.push(dataModel.itemTemplates.findOne({
					where: { itemTemplateId },
					include: [{
						as: "strings",
						model: dataModel.itemStrings,
						where: { language: i18n.getLocale() },
						required: false
					}]
				}));
			});

			(await Promise.all(promises)).forEach(item => {
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
module.exports.editAction = ({ i18n, logger, hub, sequelize, reportModel, boxModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("title").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(i18n.__("Title must be between 1 and 1024 characters.")),
		body("content").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("Description must be between 1 and 2048 characters.")),
		body("icon").optional().trim()
			.isLength({ max: 2048 }).withMessage(i18n.__("Icon must be between 1 and 255 characters.")),
		body("days")
			.isInt({ min: 1, max: 4000 }).withMessage(i18n.__("Days field must contain the value as a number.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1 }).withMessage(i18n.__("Item template ID field has invalid value."))
			.custom(value => dataModel.itemTemplates.findOne({
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

			const box = await boxModel.info.findOne({
				where: { id },
				include: [{
					as: "item",
					model: boxModel.items,
					order: [
						["createdAt", "ASC"]
					]
				}]
			});

			if (box === null) {
				return res.redirect("/boxes");
			}

			const items = [];
			const resolvedItems = {};

			if (itemTemplateIds) {
				itemTemplateIds.forEach(itemTemplateId => {
					items.push(dataModel.itemTemplates.findOne({
						where: { itemTemplateId },
						include: [{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}]
					}));
				});
			}

			(await Promise.all(items)).forEach(item => {
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

			await sequelize.transaction(async transaction => {
				const promises = [
					boxModel.info.update({
						icon,
						title,
						content,
						days
					}, {
						where: { id: box.get("id") },
						transaction
					})
				];

				box.get("item").forEach(boxItem => {
					const itemTemplateId = boxItem.get("itemTemplateId");
					const index = Object.keys(itemTemplateIds).find(k => itemTemplateIds[k] == itemTemplateId);

					if (itemTemplateIds[index]) {
						if (!boxItemIds[index]) {
							if (!resolvedItems[itemTemplateId]) return;

							promises.push(hub.createServiceItem(
								req.user.userSn || 0,
								itemTemplateId,
								1,
								moment().utc().format("YYYY-MM-DD HH:mm:ss"),
								true,
								resolvedItems[itemTemplateId].get("strings")[0]?.get("string"),
								helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")[0]?.get("toolTip")),
								"1,1,1"
							).then(boxItemId =>
								boxModel.items.update({
									boxItemId,
									boxItemCount: boxItemCounts[index] || 1
								}, {
									where: { id: boxItem.get("id") },
									transaction
								})
							));
						} else {
							promises.push(boxModel.items.update({
								boxItemId: boxItemIds[index] || null,
								boxItemCount: boxItemCounts[index] || 1
							}, {
								where: { id: boxItem.get("id") },
								transaction
							}));
						}
					} else {
						if (boxItem.get("boxItemId")) {
							promises.push(hub.removeServiceItem(boxItem.get("boxItemId")));
						}

						promises.push(boxModel.items.destroy({
							where: { id: boxItem.get("id") },
							transaction
						}));
					}
				});

				if (itemTemplateIds) {
					itemTemplateIds.forEach((itemTemplateId, index) =>
						promises.push(boxModel.items.findOne({
							where: {
								boxId: box.get("id"),
								itemTemplateId
							}
						}).then(boxItem => {
							if (boxItem === null) {
								if (!boxItemIds[index]) {
									if (!resolvedItems[itemTemplateId]) return;

									return hub.createServiceItem(
										req.user.userSn || 0,
										itemTemplateId,
										1,
										moment().utc().format("YYYY-MM-DD HH:mm:ss"),
										true,
										resolvedItems[itemTemplateId].get("strings")[0]?.get("string"),
										helpers.formatStrsheet(resolvedItems[itemTemplateId].get("strings")[0]?.get("toolTip")),
										"1,1,1"
									).then(boxItemId =>
										boxModel.items.create({
											boxId: box.get("id"),
											itemTemplateId,
											boxItemId,
											boxItemCount: boxItemCounts[index] || 1
										}, {
											transaction
										})
									);
								} else {
									return boxModel.items.create({
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
module.exports.deleteAction = ({ logger, hub, sequelize, reportModel, shopModel, boxModel }) => [
	accessFunctionHandler,
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

			const boxItems = await boxModel.items.findAll({
				where: { boxId: id }
			});

			await sequelize.transaction(async transaction => {
				const promises = [
					boxModel.info.destroy({
						where: { id },
						transaction
					})
				];

				boxItems.forEach(boxItem => {
					if (boxItem.get("boxItemId")) {
						promises.push(boxModel.items.findOne({
							where: {
								id: { [Op.ne]: boxItem.get("id") },
								boxItemId: boxItem.get("boxItemId")
							}
						}).then(resultBoxItem => shopModel.productItems.findOne({
							where: {
								boxItemId: boxItem.get("boxItemId")
							}
						}).then(resultProductItem => {
							if (resultBoxItem === null && resultProductItem === null) {
								promises.push(hub.removeServiceItem(boxItem.get("boxItemId")));
							}
						})));

						promises.push(boxModel.items.destroy({
							where: { id: boxItem.get("id") },
							transaction
						}));
					} else {
						promises.push(boxModel.items.destroy({
							where: { id: boxItem.get("id") },
							transaction
						}));
					}
				});

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
module.exports.send = ({ i18n, logger, hub, serverModel, boxModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { id } = req.query;

		try {
			const box = await boxModel.info.findOne({
				where: { id },
				include: [{
					as: "item",
					model: boxModel.items,
					include: [
						{
							as: "template",
							model: dataModel.itemTemplates
						},
						{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}
					],
					order: [
						["createdAt", "ASC"]
					]
				}]
			});

			if (box === null || box.get("item").length === 0) {
				return res.redirect("/boxes");
			}

			const servers = await serverModel.info.findAll({
				where: { isEnabled: 1 }
			});

			const promises = [];
			const itemChecks = {};

			box.get("item").forEach(item =>
				promises.push(
					hub.getServiceItem(item.get("boxItemId")).then(resultSet => {
						if (resultSet.length > 0) {
							itemChecks[item.get("boxItemId")] = !!parseInt(resultSet[0].serviceItemEnableFlag);;
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
				items: box.get("item"),
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
module.exports.sendAction = ({ i18n, logger, queue, hub, serverModel, reportModel, accountModel, boxModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("serverId").optional({ checkFalsy: true })
			.isInt().withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => serverModel.info.findOne({
				where: {
					...req.body.serverId ? { serverId: req.body.serverId } : {}
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
			.isInt().withMessage(i18n.__("Character ID field must contain a valid number."))
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
			const box = await boxModel.info.findOne({
				where: { id },
				include: [{
					as: "item",
					model: boxModel.items,
					include: [
						{
							as: "template",
							model: dataModel.itemTemplates
						},
						{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}
					],
					order: [
						["createdAt", "ASC"]
					]
				}]
			});

			if (box === null || box.get("item").length === 0) {
				return res.redirect("/boxes");
			}

			const user = await accountModel.info.findOne({
				where: { accountDBID }
			});

			const servers = await serverModel.info.findAll({
				where: { isEnabled: 1 }
			});

			const promises = [];
			const itemChecks = {};

			box.get("item").forEach(item =>
				promises.push(
					hub.getServiceItem(item.get("boxItemId")).then(resultSet => {
						if (resultSet.length > 0) {
							itemChecks[item.get("boxItemId")] = !!parseInt(resultSet[0].serviceItemEnableFlag);
						}
					})
				)
			);

			await Promise.all(promises);

			if (box.get("item").length !== Object.keys(itemChecks).length) {
				errors.push({
					msg: i18n.__("There are no Service Items for the specified box item IDs.")
				});
			}

			const task = await queue.findByTag("createBox", id, 1);

			if (task.length > 0) {
				errors.push({
					msg: i18n.__("Task with this box ID is already running. Check tasks queue.")
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
					items: box.get("item"),
					itemChecks
				});
			}

			// Send to accountDBID via hub
			queue.insert("createBox", [
				{
					content: box.get("content"),
					title: box.get("title"),
					icon: box.get("icon"),
					days: box.get("days"),
					items: box.get("item").map(item => ({
						item_id: item.get("boxItemId"),
						item_count: item.get("boxItemCount"),
						item_template_id: item.get("itemTemplateId")
					}))
				},
				accountDBID,
				serverId || null,
				characterId || null,
				user.get("lastLoginServer"),
				id,
				4
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
		res.redirect(`/boxes/send_result?id=${req.query.id || ""}`);
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendAll = ({ i18n, logger, hub, sequelize, serverModel, boxModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		const { id } = req.query;

		try {
			const box = await boxModel.info.findOne({
				where: { id },
				include: [{
					as: "item",
					model: boxModel.items,
					include: [
						{
							as: "template",
							model: dataModel.itemTemplates
						},
						{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}
					],
					order: [
						["createdAt", "ASC"]
					]
				}]
			});

			if (box === null || box.get("item").length === 0) {
				return res.redirect("/boxes");
			}

			const servers = await serverModel.info.findAll({
				where: { isEnabled: 1 }
			});

			const promises = [];
			const itemChecks = {};

			box.get("item").forEach(item =>
				promises.push(
					hub.getServiceItem(item.get("boxItemId")).then(resultSet => {
						if (resultSet.length > 0) {
							itemChecks[item.get("boxItemId")] = !!parseInt(resultSet[0].serviceItemEnableFlag);;
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
				items: box.get("item"),
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
module.exports.sendAllAction = ({ i18n, logger, queue, hub, serverModel, reportModel, accountModel, boxModel, dataModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("serverId").optional({ checkFalsy: true })
			.isInt().withMessage(i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => serverModel.info.findOne({
				where: {
					...req.body.serverId ? { serverId: req.body.serverId } : {}
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
			const box = await boxModel.info.findOne({
				where: { id },
				include: [{
					as: "item",
					model: boxModel.items,
					include: [
						{
							as: "template",
							model: dataModel.itemTemplates
						},
						{
							as: "strings",
							model: dataModel.itemStrings,
							where: { language: i18n.getLocale() },
							required: false
						}
					],
					order: [
						["createdAt", "ASC"]
					]
				}]
			});

			if (box === null || box.get("item").length === 0) {
				return res.redirect("/boxes");
			}

			const servers = await serverModel.info.findAll({
				where: { isEnabled: 1 }
			});

			const users = await accountModel.info.findAll({
				where: {
					...serverId ? { lastLoginServer: serverId } : {},
					lastLoginTime: {
						[Op.gt]: moment.tz(loginAfterTime, req.user.tz).toDate()
					}
				}
			});

			const promises = [];
			const itemChecks = {};

			box.get("item").forEach(item =>
				promises.push(
					hub.getServiceItem(item.get("boxItemId")).then(resultSet => {
						if (resultSet.length > 0) {
							itemChecks[item.get("boxItemId")] = !!parseInt(resultSet[0].serviceItemEnableFlag);;
						}
					})
				)
			);

			await Promise.all(promises);

			if (box.get("item").length !== Object.keys(itemChecks).length) {
				errors.push({
					msg: i18n.__("There are no Service Items for the specified box item IDs.")
				});
			}

			const task = await queue.findByTag("createBox", id, 1);

			if (task.length > 0) {
				errors.push({
					msg: i18n.__("Task with this box ID is already running. Check tasks queue.")
				});
			}

			if (errors.length > 0) {
				return res.render("adminBoxesSendAll", {
					layout: "adminLayout",
					errors,
					servers,
					id,
					serverId,
					loginAfterTime: moment.tz(loginAfterTime, req.user.tz),
					title: box.get("title"),
					content: box.get("content"),
					icon: box.get("icon"),
					days: box.get("days"),
					items: box.get("item"),
					itemChecks
				});
			}

			// Send to all users via hub
			users.forEach(user =>
				queue.insert("createBox", [
					{
						content: box.get("content"),
						title: box.get("title"),
						icon: box.get("icon"),
						days: box.get("days"),
						items: box.get("item").map(item => ({
							item_id: item.get("boxItemId"),
							item_count: item.get("boxItemCount"),
							item_template_id: item.get("itemTemplateId")
						}))
					},
					user.get("accountDBID"),
					serverId || null,
					null,
					user.get("lastLoginServer"),
					id,
					4
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
		res.redirect(`/boxes/send_result?id=${req.query.id || ""}`);
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendResult = ({ logger, queue }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { id } = req.query;

		if (!id) {
			return res.redirect("/boxes");
		}

		queue.findByTag("createBox", id, 10).then(tasks =>
			res.render("adminBoxesSendResult", {
				layout: "adminLayout",
				queue,
				tasks,
				id
			})
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.logs = ({ logger, serverModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		let { from, to } = req.query;
		const { accountDBID, serverId } = req.query;

		from = from ? moment.tz(from, req.user.tz) : moment().subtract(30, "days");
		to = to ? moment.tz(to, req.user.tz) : moment().add(30, "days");

		reportModel.boxes.findAll({
			where: {
				...accountDBID ? { accountDBID } : {},
				...serverId ? { [Op.or]: [{ serverId }, { serverId: null }] } : {},
				createdAt: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			order: [
				["createdAt", "DESC"]
			]
		}).then(logs =>
			serverModel.info.findAll().then(servers => {
				res.render("adminBoxesLogs", {
					layout: "adminLayout",
					moment,
					servers,
					logs,
					from,
					to,
					serverId,
					accountDBID
				});
			})
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];