"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");
const body = require("express-validator").body;
const Op = require("sequelize").Op;

const ApiError = require("../lib/apiError");
const { ServiceItem } = require("../utils/boxHelper");
const { validationHandler } = require("../middlewares/gateway.middlewares");

/**
 * @param {modules} modules
 */
module.exports.ListBoxes = ({ queue, boxModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const list = new Map();

		const boxes = await boxModel.info.findAll({
			include: [{
				as: "item",
				model: boxModel.items
			}],
			order: [
				["id", "DESC"],
				[{ as: "item", model: boxModel.items }, "createdAt", "ASC"]
			]
		});

		for (const box of boxes) {
			const items = [];

			box.get("item").forEach(item => {
				items.push({
					ItemTemplateId: item.get("itemTemplateId"),
					ServiceItemId: item.get("boxItemId"),
					Count: item.get("boxItemCount")
				});
			});

			const task = await queue.findByTag("createBox", box.get("id"), 1);
			const isProcessing = task !== null && task[0] !== undefined;

			list.set(box.get("id"), {
				Id: box.get("id"),
				Title: box.get("title"),
				Content: box.get("content"),
				Icon: box.get("icon"),
				Days: box.get("days"),
				items,
				IsProcessing: isProcessing
			});
		}

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success",
			Boxes: Array.from(list.values())
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SendBoxToAccountByUserNo = modules => [
	[
		body("boxId").trim().notEmpty(),
		body("userNo").trim()
			.isInt().withMessage("Must contain a valid number")
			.custom(value => modules.accountModel.info.findOne({
				where: { accountDBID: value }
			}).then(data => {
				if (value && data === null) {
					return Promise.reject("Contains not existing account ID");
				}
			})),
		body("characterId").optional({ checkFalsy: true }).trim()
			.isInt().withMessage("Must contain a valid number")
			.custom((value, { req }) => modules.accountModel.characters.findOne({
				where: {
					characterId: req.body.characterId,
					serverId: req.body.serverId,
					accountDBID: req.body.accountDBID
				}
			}).then(data => {
				if (req.body.characterId && data === null) {
					return Promise.reject("Contains not existing character ID");
				}
			})),
		body("serverId").optional({ checkFalsy: true }).trim()
			.isInt().withMessage("Must contain a valid number")
			.custom((value, { req }) => modules.serverModel.info.findOne({
				where: { ...req.body.serverId ? { serverId: req.body.serverId } : {} }
			}).then(data => {
				if (data === null) {
					return Promise.reject("Contains not existing server ID");
				}
			}))
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const task = await modules.queue.findByTag("createBox", req.body.boxId, 1);

		if (task.length > 0) {
			throw new ApiError("This box is being processed", 100);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { boxId, serverId, userNo, characterId } = req.body;

		const serviceItem = new ServiceItem(modules);

		const box = await modules.boxModel.info.findOne({
			where: { id: boxId },
			include: [{
				as: "item",
				model: modules.boxModel.items
			}],
			order: [
				[{ as: "item", model: modules.boxModel.items }, "createdAt", "ASC"]
			]
		});

		if (box === null || box.get("item").length === 0) {
			throw new ApiError("Box not found", 2);
		}

		const user = await modules.accountModel.info.findOne({
			where: { accountDBID: userNo }
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
			errors.push("There are no Service Items for the specified service item IDs");
		}

		const task = await modules.queue.findByTag("createBox", boxId, 1);

		if (task.length > 0) {
			errors.push("Task with this box ID is already running");
		}

		if (errors.length > 0) {
			throw new ApiError(errors.join(", "), 102);
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
			userNo,
			serverId || null,
			characterId || null,
			user.get("lastLoginServer"),
			boxId,
			4
		],
		box.get("id"));

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.SendBoxesToAllByServerId = modules => [
	[
		body("boxId").trim().notEmpty(),
		body("loginAfterTime").trim()
			.isISO8601().withMessage("Must contain a valid ISO 8601"),
		body("serverId").optional({ checkFalsy: true }).trim()
			.isInt().withMessage("Must contain a valid number")
			.custom((value, { req }) => modules.serverModel.info.findOne({
				where: { ...req.body.serverId ? { serverId: req.body.serverId } : {} }
			}).then(data => {
				if (data === null) {
					return Promise.reject("Contains not existing server ID");
				}
			}))
	],
	validationHandler(modules.logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const task = await modules.queue.findByTag("createBox", req.body.boxId, 1);

		if (task.length > 0) {
			throw new ApiError("This box is being processed", 100);
		}

		next();
	},
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const { boxId, serverId, loginAfterTime } = req.body;

		const serviceItem = new ServiceItem(modules);

		const box = await modules.boxModel.info.findOne({
			where: { id: boxId },
			include: [{
				as: "item",
				model: modules.boxModel.items
			}],
			order: [
				[{ as: "item", model: modules.boxModel.items }, "createdAt", "ASC"]
			]
		});

		if (box === null || box.get("item").length === 0) {
			throw new ApiError("Box not found", 2);
		}

		const users = await modules.accountModel.info.findAll({
			where: {
				...serverId ? { lastLoginServer: serverId } : {},
				lastLoginTime: {
					[Op.gt]: moment(loginAfterTime).toDate()
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
			errors.push("There are no Service Items for the specified service item IDs");
		}

		const task = await modules.queue.findByTag("createBox", boxId, 1);

		if (task.length > 0) {
			errors.push("Task with this box ID is already running");
		}

		if (errors.length > 0) {
			throw new ApiError(errors.join(", "), 102);
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
				boxId,
				4
			],
			box.get("id"))
		);

		res.json({
			Return: true,
			ReturnCode: 0,
			Msg: "success"
		});
	}
];