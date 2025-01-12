"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const { query, body } = require("express-validator");
const moment = require("moment-timezone");
const Op = require("sequelize").Op;

const helpers = require("../utils/helpers");
const ServiceItem = require("../utils/boxHelper").ServiceItem;

const {
	accessFunctionHandler,
	validationHandler,
	formValidationHandler,
	formResultErrorHandler,
	formResultSuccessHandler,
	writeOperationReport
} = require("../middlewares/admin.middlewares");

const ApiError = require("../lib/apiError");

/**
 * @param {modules} modules
 */
module.exports.index = ({ i18n, queue, boxModel, datasheetModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const boxes = new Map();
		const tasks = [];

		(await boxModel.info.findAll({
			include: [{
				as: "item",
				model: boxModel.items
			}],
			order: [
				["id", "DESC"],
				[{ as: "item", model: boxModel.items }, "createdAt", "ASC"]
			]
		})).forEach(box => {
			const items = [];

			box.get("item").forEach(item => {
				const itemData = datasheetModel.itemData[i18n.getLocale()]?.getOne(item.get("itemTemplateId"));
				const strSheetItem = datasheetModel.strSheetItem[i18n.getLocale()]?.getOne(item.get("itemTemplateId"));

				items.push({
					itemTemplateId: item.get("itemTemplateId"),
					boxItemId: item.get("boxItemId"),
					boxItemCount: item.get("boxItemCount"),
					icon: itemData?.icon,
					rareGrade: itemData?.rareGrade,
					string: strSheetItem?.string
				});
			});

			boxes.set(box.get("id"), {
				title: box.get("title"),
				content: box.get("content"),
				icon: box.get("icon"),
				days: box.get("days"),
				items,
				processing: false
			});

			tasks.push(queue.findByTag("createBox", box.get("id"), 1));
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
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = () => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		res.render("adminBoxesAdd", {
			layout: "adminLayout"
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = modules => [
	accessFunctionHandler,
	[
		body("title").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(modules.i18n.__("Title must be between 1 and 1024 characters.")),
		body("content").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(modules.i18n.__("Description must be between 1 and 2048 characters.")),
		body("icon").optional().trim()
			.isLength({ max: 2048 }).withMessage(modules.i18n.__("Icon must be between 1 and 255 characters.")),
		body("days")
			.isInt({ min: 1, max: 4000 }).withMessage(modules.i18n.__("Days field must contain the value as a number.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1, max: 1e8 }).withMessage(modules.i18n.__("Item template ID field has invalid value."))
			.custom(value => {
				if (value && !modules.datasheetModel.itemData[modules.i18n.getLocale()]?.getOne(value)) {
					return Promise.reject(`${modules.i18n.__("A non-existent item has been added")}: ${value}`);
				}
				return true;
			})
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);
				return !itemTemplateIds.includes(value);
			})
			.withMessage(modules.i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1, max: 1e8 }).withMessage(modules.i18n.__("Service item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1, max: 1e6 }).withMessage(modules.i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(modules.i18n.__("No items have been added to the box."))
	],
	formValidationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { title, content, icon, days, itemTemplateIds, boxItemIds, boxItemCounts } = req.body;

		const serviceItem = new ServiceItem(modules);
		const resolvedItems = {};

		if (itemTemplateIds) {
			itemTemplateIds.forEach(itemTemplateId =>
				resolvedItems[itemTemplateId] = modules.datasheetModel.strSheetItem[modules.i18n.getLocale()]?.getOne(itemTemplateId)
			);
		}

		await modules.sequelize.transaction(async () => {
			const box = await modules.boxModel.info.create({
				title,
				content,
				icon,
				days
			});

			const promises = [];

			if (itemTemplateIds) {
				itemTemplateIds.forEach((itemTemplateId, index) => {
					if (!resolvedItems[itemTemplateId]) return;

					promises.push(serviceItem.checkCreate(
						boxItemIds[index],
						itemTemplateId,
						resolvedItems[itemTemplateId].string,
						helpers.formatStrsheet(resolvedItems[itemTemplateId].toolTip),
						req.user.userSn || 0
					).then(boxItemId =>
						modules.boxModel.items.create({
							boxId: box.get("id"),
							itemTemplateId,
							boxItemId,
							boxItemCount: boxItemCounts[index]
						})
					));
				});
			}

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(modules.reportModel),
	formResultErrorHandler(modules.logger),
	formResultSuccessHandler("/boxes")
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, boxModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		const box = await boxModel.info.findOne({
			where: { id },
			include: [{
				as: "item",
				model: boxModel.items
			}],
			order: [
				[{ as: "item", model: boxModel.items }, "createdAt", "ASC"]
			]
		});

		if (box === null) {
			throw Error("Object not found");
		}

		const itemTemplateIds = [];
		const boxItemIds = [];
		const boxItemCounts = [];

		box.get("item").forEach(boxItem => {
			itemTemplateIds.push(boxItem.get("itemTemplateId"));
			boxItemIds.push(boxItem.get("boxItemId"));
			boxItemCounts.push(boxItem.get("boxItemCount"));
		});

		res.render("adminBoxesEdit", {
			layout: "adminLayout",
			id,
			title: box.get("title"),
			content: box.get("content"),
			icon: box.get("icon"),
			days: box.get("days"),
			itemTemplateIds,
			boxItemIds,
			boxItemCounts,
			validate: 0
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = modules => [
	accessFunctionHandler,
	[
		query("id").notEmpty(),
		body("title").trim()
			.isLength({ min: 1, max: 1024 }).withMessage(modules.i18n.__("Title must be between 1 and 1024 characters.")),
		body("content").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(modules.i18n.__("Description must be between 1 and 2048 characters.")),
		body("icon").optional().trim()
			.isLength({ max: 2048 }).withMessage(modules.i18n.__("Icon must be between 1 and 255 characters.")),
		body("days")
			.isInt({ min: 1, max: 4000 }).withMessage(modules.i18n.__("Days field must contain the value as a number.")),
		// Items
		body("itemTemplateIds.*")
			.isInt({ min: 1, max: 1e8 }).withMessage(modules.i18n.__("Item template ID field has invalid value."))
			.custom(value => {
				if (value && !modules.datasheetModel.itemData[modules.i18n.getLocale()]?.getOne(value)) {
					return Promise.reject(`${modules.i18n.__("A non-existent item has been added")}: ${value}`);
				}
				return true;
			})
			.custom((value, { req }) => {
				const itemTemplateIds = req.body.itemTemplateIds.filter((e, i) =>
					req.body.itemTemplateIds.lastIndexOf(e) == i && req.body.itemTemplateIds.indexOf(e) != i
				);
				return !itemTemplateIds.includes(value);
			})
			.withMessage(modules.i18n.__("Added item already exists.")),
		body("boxItemIds.*").optional({ checkFalsy: true })
			.isInt({ min: 1, max: 1e8 }).withMessage(modules.i18n.__("Service item ID field has invalid value.")),
		body("boxItemCounts.*")
			.isInt({ min: 1, max: 1e6 }).withMessage(modules.i18n.__("Count field has invalid value.")),
		body("itemTemplateIds").notEmpty()
			.withMessage(modules.i18n.__("No items have been added to the box."))
	],
	formValidationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { title, content, icon, days, itemTemplateIds, boxItemIds, boxItemCounts } = req.body;

		const serviceItem = new ServiceItem(modules);

		const box = await modules.boxModel.info.findOne({
			where: { id },
			include: [{
				as: "item",
				model: modules.boxModel.items
			}],
			order: [
				[{ as: "item", model: modules.boxModel.items }, "createdAt", "ASC"]
			]
		});

		if (box === null) {
			throw Error("Object not found");
		}

		const resolvedItems = {};

		if (itemTemplateIds) {
			itemTemplateIds.forEach(itemTemplateId =>
				resolvedItems[itemTemplateId] = modules.datasheetModel.strSheetItem[modules.i18n.getLocale()]?.getOne(itemTemplateId)
			);
		}

		await modules.sequelize.transaction(async () => {
			const promises = [
				modules.boxModel.info.update({
					icon,
					title,
					content,
					days
				}, {
					where: { id: box.get("id") }
				})
			];

			box.get("item").forEach(boxItem => {
				const itemTemplateId = boxItem.get("itemTemplateId");
				const index = Object.keys(itemTemplateIds).find(k => itemTemplateIds[k] == itemTemplateId);

				if (itemTemplateIds[index]) {
					if (boxItemIds[index] != boxItem.get("boxItemId") ||
						boxItemCounts[index] != boxItem.get("boxItemCount")
					) {
						if (!resolvedItems[itemTemplateId]) return;

						promises.push(serviceItem.checkCreate(
							boxItemIds[index],
							itemTemplateId,
							resolvedItems[itemTemplateId].string,
							helpers.formatStrsheet(resolvedItems[itemTemplateId].toolTip),
							req.user.userSn || 0
						).then(boxItemId =>
							modules.boxModel.items.update({
								boxItemId,
								boxItemCount: boxItemCounts[index] || 1
							}, {
								where: { id: boxItem.get("id") }
							})
						));
					}
				} else {
					promises.push(modules.boxModel.items.destroy({
						where: { id: boxItem.get("id") }
					}));

					promises.push(modules.boxModel.items.findOne({
						where: {
							id: { [Op.ne]: boxItem.get("id") },
							boxItemId: boxItem.get("boxItemId")
						}
					}).then(resultBoxItem => modules.shopModel.productItems.findOne({
						where: {
							boxItemId: boxItem.get("boxItemId")
						}
					}).then(resultProductItem => {
						if (resultBoxItem === null && resultProductItem === null) {
							promises.push(serviceItem.remove(boxItem.get("boxItemId")));
						}
					})));
				}
			});

			if (itemTemplateIds) {
				itemTemplateIds.forEach((itemTemplateId, index) =>
					promises.push(modules.boxModel.items.findOne({
						where: {
							boxId: box.get("id"),
							itemTemplateId
						}
					}).then(boxItem => {
						if (boxItem !== null || !resolvedItems[itemTemplateId]) return;

						return serviceItem.checkCreate(
							boxItemIds[index],
							itemTemplateId,
							resolvedItems[itemTemplateId].string,
							helpers.formatStrsheet(resolvedItems[itemTemplateId].toolTip),
							req.user.userSn || 0
						).then(boxItemId =>
							modules.boxModel.items.create({
								boxId: box.get("id"),
								itemTemplateId,
								boxItemId,
								boxItemCount: boxItemCounts[index] || 1
							})
						);
					}))
				);
			}

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(modules.reportModel),
	formResultErrorHandler(modules.logger),
	formResultSuccessHandler("/boxes")
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = modules => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").notEmpty()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const serviceItem = new ServiceItem(modules);

		const boxItems = await modules.boxModel.items.findAll({
			where: { boxId: id }
		});

		await modules.sequelize.transaction(async () => {
			const promises = [
				modules.boxModel.info.destroy({
					where: { id }
				})
			];

			boxItems.forEach(boxItem => {
				if (boxItem.get("boxItemId")) {
					promises.push(modules.boxModel.items.findOne({
						where: {
							id: { [Op.ne]: boxItem.get("id") },
							boxItemId: boxItem.get("boxItemId")
						}
					}).then(resultBoxItem => modules.shopModel.productItems.findOne({
						where: {
							boxItemId: boxItem.get("boxItemId")
						}
					}).then(resultProductItem => {
						if (resultBoxItem === null && resultProductItem === null) {
							promises.push(serviceItem.remove(boxItem.get("boxItemId")));
						}
					})));

					promises.push(modules.boxModel.items.destroy({
						where: { id: boxItem.get("id") }
					}));
				} else {
					promises.push(modules.boxModel.items.destroy({
						where: { id: boxItem.get("id") }
					}));
				}
			});

			await Promise.all(promises);
		});

		next();
	},
	writeOperationReport(modules.reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		res.redirect("/boxes");
	}
];

/**
 * @param {modules} modules
 */
module.exports.send = modules => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").notEmpty()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const serviceItem = new ServiceItem(modules);

		const box = await modules.boxModel.info.findOne({
			where: { id },
			include: [{
				as: "item",
				model: modules.boxModel.items
			}],
			order: [
				[{ as: "item", model: modules.boxModel.items }, "createdAt", "ASC"]
			]
		});

		if (box === null || box.get("item").length === 0) {
			throw Error("Object not found");
		}

		const servers = await modules.serverModel.info.findAll({
			where: { isEnabled: 1 }
		});

		const promises = [];
		const itemChecks = new Set();

		box.get("item").forEach(item =>
			promises.push(
				serviceItem.checkExists(item.get("boxItemId")).then(exists => {
					if (exists) {
						itemChecks.add(item.get("boxItemId"));
					}
				})
			)
		);

		await Promise.all(promises);

		res.render("adminBoxesSend", {
			layout: "adminLayout",
			servers,
			id,
			title: box.get("title"),
			content: box.get("content"),
			icon: box.get("icon"),
			days: box.get("days"),
			items: box.get("item"),
			itemChecks
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendAction = modules => [
	accessFunctionHandler,
	[
		query("id").notEmpty(),
		body("serverId").optional({ checkFalsy: true })
			.isInt().withMessage(modules.i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => modules.serverModel.info.findOne({
				where: { ...req.body.serverId ? { serverId: req.body.serverId } : {} }
			}).then(data => {
				if (data === null) {
					return Promise.reject(modules.i18n.__("Server ID field contains not existing server ID."));
				}
			})),
		body("accountDBID")
			.isInt().withMessage(modules.i18n.__("Account ID field must contain a valid number."))
			.custom(value => modules.accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject(modules.i18n.__("Account ID field contains not existing account ID."));
				}
			})),
		body("characterId").optional({ checkFalsy: true })
			.isInt().withMessage(modules.i18n.__("Character ID field must contain a valid number."))
			.custom((value, { req }) => modules.accountModel.characters.findOne({
				where: {
					characterId: req.body.characterId,
					serverId: req.body.serverId,
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.characterId && data === null) {
					return Promise.reject(modules.i18n.__("Character ID field contains not existing character ID."));
				}
			}))
	],
	formValidationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const task = await modules.queue.findByTag("createBox", req.query.id, 1);

		if (task.length > 0) {
			throw new ApiError("This box is being processed", 100);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { serverId, accountDBID, characterId } = req.body;


		const serviceItem = new ServiceItem(modules);

		const box = await modules.boxModel.info.findOne({
			where: { id },
			include: [{
				as: "item",
				model: modules.boxModel.items
			}],
			order: [
				[{ as: "item", model: modules.boxModel.items }, "createdAt", "ASC"]
			]
		});

		if (box === null || box.get("item").length === 0) {
			throw Error("Object not found");
		}

		const user = await modules.accountModel.info.findOne({
			where: { accountDBID }
		});

		const promises = [];
		const itemChecks = new Set();

		box.get("item").forEach(item =>
			promises.push(
				serviceItem.checkExists(item.get("boxItemId")).then(exists => {
					if (exists) {
						itemChecks.add(item.get("boxItemId"));
					}
				})
			)
		);

		await Promise.all(promises);

		const errors = [];

		if (box.get("item").length !== itemChecks.size) {
			errors.push({
				msg: modules.i18n.__("There are no Service Items for the specified service item IDs.")
			});
		}

		const task = await modules.queue.findByTag("createBox", id, 1);

		if (task.length > 0) {
			errors.push({
				msg: modules.i18n.__("Task with this box ID is already running. Check tasks queue.")
			});
		}

		if (errors.length > 0) {
			res.json({ result_code: 2, msg: "", errors });
			return;
		}

		// Send to accountDBID via hub
		modules.queue.insert("createBox", [
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
	},
	writeOperationReport(modules.reportModel),
	formResultErrorHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		formResultSuccessHandler(`/boxes/send_result?id=${req.query.id || ""}`)(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendAll = modules => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").notEmpty()
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const task = await modules.queue.findByTag("createBox", req.query.id, 1);

		if (task.length > 0) {
			throw new ApiError("This box is being processed", 100);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const serviceItem = new ServiceItem(modules);

		const box = await modules.boxModel.info.findOne({
			where: { id },
			include: [{
				as: "item",
				model: modules.boxModel.items
			}],
			order: [
				[{ as: "item", model: modules.boxModel.items }, "createdAt", "ASC"]
			]
		});

		if (box === null || box.get("item").length === 0) {
			return res.redirect("/boxes");
		}

		const servers = await modules.serverModel.info.findAll({
			where: { isEnabled: 1 }
		});

		const promises = [];
		const itemChecks = new Set();

		box.get("item").forEach(item =>
			promises.push(
				serviceItem.checkExists(item.get("boxItemId")).then(exists => {
					if (exists) {
						itemChecks.add(item.get("boxItemId"));
					}
				})
			)
		);

		await Promise.all(promises);

		res.render("adminBoxesSendAll", {
			layout: "adminLayout",
			moment,
			servers,
			id,
			title: box.get("title"),
			content: box.get("content"),
			icon: box.get("icon"),
			days: box.get("days"),
			items: box.get("item"),
			itemChecks
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendAllAction = modules => [
	accessFunctionHandler,
	[
		query("id").notEmpty(),
		body("serverId").optional({ checkFalsy: true })
			.isInt().withMessage(modules.i18n.__("Server ID field must contain a valid number."))
			.custom((value, { req }) => modules.serverModel.info.findOne({
				where: { ...req.body.serverId ? { serverId: req.body.serverId } : {} }
			}).then(data => {
				if (data === null) {
					return Promise.reject(modules.i18n.__("Server ID field contains not existing server ID."));
				}
			})),
		body("loginAfterTime")
			.isISO8601().withMessage(modules.i18n.__("Last login field must contain a valid date."))
	],
	formValidationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;
		const { serverId, loginAfterTime } = req.body;

		const serviceItem = new ServiceItem(modules);

		const box = await modules.boxModel.info.findOne({
			where: { id },
			include: [{
				as: "item",
				model: modules.boxModel.items
			}],
			order: [
				[{ as: "item", model: modules.boxModel.items }, "createdAt", "ASC"]
			]
		});

		if (box === null || box.get("item").length === 0) {
			throw Error("Object not found");
		}

		const users = await modules.accountModel.info.findAll({
			where: {
				...serverId ? { lastLoginServer: serverId } : {},
				lastLoginTime: {
					[Op.gt]: moment.tz(loginAfterTime, req.user.tz).toDate()
				}
			}
		});

		const promises = [];
		const itemChecks = new Set();

		box.get("item").forEach(item =>
			promises.push(
				serviceItem.checkExists(item.get("boxItemId")).then(exists => {
					if (exists) {
						itemChecks.add(item.get("boxItemId"));
					}
				})
			)
		);

		await Promise.all(promises);

		const errors = [];

		if (box.get("item").length !== itemChecks.size) {
			errors.push({
				msg: modules.i18n.__("There are no Service Items for the specified service item IDs.")
			});
		}

		const task = await modules.queue.findByTag("createBox", id, 1);

		if (task.length > 0) {
			errors.push({
				msg: modules.i18n.__("Task with this box ID is already running. Check tasks queue.")
			});
		}

		if (errors.length > 0) {
			res.json({ result_code: 2, msg: "", errors });
			return;
		}

		// Send to all users via hub
		users.forEach(user =>
			modules.queue.insert("createBox", [
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
	},
	writeOperationReport(modules.reportModel),
	formResultErrorHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		formResultSuccessHandler(`/boxes/send_result?id=${req.query.id || ""}`)(req, res, next);
	}
];

/**
 * @param {modules} modules
 */
module.exports.sendResult = ({ logger, queue }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		query("id").notEmpty()
	],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { id } = req.query;

		const tasks = await queue.findByTag("createBox", id, 10);

		res.render("adminBoxesSendResult", {
			layout: "adminLayout",
			queue,
			tasks,
			id
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.logs = ({ serverModel, accountModel, reportModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { accountDBID, serverId } = req.query;
		const from = req.query.from ? moment.tz(req.query.from, req.user.tz) : moment().subtract(30, "days");
		const to = req.query.to ? moment.tz(req.query.to, req.user.tz) : moment().add(30, "days");

		const logs = await reportModel.boxes.findAll({
			where: {
				...accountDBID ? { accountDBID } : {},
				...serverId ? { [Op.or]: [{ serverId }, { serverId: null }] } : {},
				createdAt: {
					[Op.gt]: from.toDate(),
					[Op.lt]: to.toDate()
				}
			},
			include: [
				{
					as: "account",
					model: accountModel.info,
					required: false,
					attributes: ["userName"]
				},
				{
					as: "server",
					model: serverModel.info,
					required: false,
					attributes: ["nameString"]
				}
			],
			order: [
				["createdAt", "DESC"]
			]
		});

		const servers = await serverModel.info.findAll();

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
	}
];