"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 */

const moment = require("moment-timezone");
const query = require("express-validator").query;
const Op = require("sequelize").Op;

const { secondsToDhms } = require("../utils/helpers");
const { apiAccessHandler, validationHandler } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.notifications = ({ queue }) => [
	apiAccessHandler,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const tasks = await queue.findByStatus(queue.status.rejected, 6);
		const items = [];

		if (req.user.type !== "steer" || Object.values(req.user.functions).includes("/tasks")) {
			tasks.forEach(task => {
				items.push({
					class: "text-danger",
					icon: "fa-warning",
					message: `(${task.get("handler")}) ${task.get("message")}`
				});
			});
		}

		res.json({
			result_code: 0,
			msg: "success",
			count: items.length,
			items
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.homeStats = ({ i18n, sequelize, datasheetModel, serverModel, accountModel, reportModel }) => [
	apiAccessHandler,
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const isSteer = req.user.type === "steer";
		const seerversItems = [];
		const activityReportItems = [];
		const cheatsReportItems = [];
		const payLogsItems = [];

		const maintenance = await serverModel.maintenance.findOne({
			where: {
				startTime: { [Op.lt]: sequelize.fn("NOW") },
				endTime: { [Op.gt]: sequelize.fn("NOW") }
			}
		});

		const servers = await serverModel.info.findAll({
			where: { isEnabled: 1 }
		});

		servers.forEach(server => {
			seerversItems.push({
				serverId: server.get("serverId"),
				isAvailable: server.get("isAvailable"),
				nameString: server.get("nameString"),
				loginIp: server.get("loginIp"),
				loginPort: server.get("loginPort"),
				usersTotal: server.get("usersTotal"),
				usersOnline: server.get("usersOnline"),
				usersOnlinePercent: Math.floor(
					(server.get("usersOnline") / server.get("thresholdMedium")) * 100
				)
			});
		});

		const activityReport = !isSteer || Object.values(req.user.functions).includes("/report_activity") ?
			await reportModel.activity.findAll({
				include: [{
					as: "account",
					required: false,
					model: accountModel.info
				}],
				offset: 0, limit: 6,
				order: [
					["reportTime", "DESC"]
				]
			}) : [];

		activityReport.forEach(report =>
			activityReportItems.push({
				reportTime: moment(report.get("reportTime")).tz(req.user.tz).format("YYYY-MM-DD HH:mm"),
				reportType: report.get("reportType") == 2 ?
					`${i18n.__("Leave game")} (${secondsToDhms(i18n.__, report.get("playTime"))})` :
					i18n.__("Enter game"),
				ip: report.get("ip"),
				accountDBID: report.get("accountDBID"),
				userName: report.get("account")?.get("userName") || "-",
				serverId: report.get("serverId")
			})
		);

		const cheatsReport = !isSteer || Object.values(req.user.functions).includes("/report_cheats") ?
			await reportModel.cheats.findAll({
				include: [{
					as: "account",
					required: false,
					model: accountModel.info
				}],
				offset: 0, limit: 6,
				order: [
					["reportTime", "DESC"]
				]
			}) : [];

		/*
		const skillIconData = datasheetModel.skillIconData.get("en")?.getAll() || [];
		const cachedSkills = new Map();
		const charactersPromises = [];

		const classIds = [
			"warrior",
			"lancer",
			"slayer",
			"berserker",
			"sorcerer",
			"archer",
			"priest",
			"elementalist",
			"soulless",
			"engineer",
			"fighter",
			"assassin",
			"glaiver"
		];

		cheatsReport.forEach(report => {
			const [account, name, hits, limit, skillId] = report.get("cheatInfo").split(",");
			const key = name + skillId + report.get("accountDBID") + report.get("serverId");

			if (!cachedSkills.has(key)) {
				cachedSkills.set(key, null);

				charactersPromises.push(accountModel.characters.findOne({
					where: {
						accountDBID: report.get("accountDBID"),
						serverId: report.get("serverId"),
						name
					}
				}).then(chatacter => {
					if (chatacter !== null) {
						const skill = skillIconData.find(s =>
							s.skillId === skillId &&
							s.class === classIds[chatacter.get("classId")]
						);

						if (skill) {
							cachedSkills.set(key, skill);
						}
					}
				}));
			}
		});

		await Promise.all(charactersPromises);
		console.log(cachedSkills.entries());
		*/

		cheatsReport.forEach(report => {
			const [account, name, hits, limit, skillId, zoneId, x, y, z, huntingZoneId, templateId] = report.get("cheatInfo").split(",");

			const dungeon = datasheetModel.strSheetDungeon.get(i18n.getLocale())?.getOne(huntingZoneId);
			const creature = datasheetModel.strSheetCreature.get(i18n.getLocale())?.getOne(huntingZoneId, templateId);

			let type = i18n.__("Other");

			switch (report.get("type")) {
				case 0:
					type = "PPS (packets/sec)";
					break;
				case 1:
					type = "Meme Slash";
					break;
			}

			cheatsReportItems.push({
				reportTime: moment(report.get("reportTime")).tz(req.user.tz).format("YYYY-MM-DD HH:mm"),
				accountDBID: report.get("accountDBID"),
				userName: report.get("account")?.get("userName") || "-",
				name,
				type,
				skill: skillId,
				hits,
				limit,
				dungeon: `(${huntingZoneId}) ${dungeon?.string || huntingZoneId}`,
				creature: `(${templateId}) ${creature?.name || templateId}`,
				coords: `${x}, ${y}, ${z}`,
				ip: report.get("ip"),
				serverId: report.get("serverId")
			});
		});

		const payLogs = !isSteer ||
			Object.values(req.user.functions).includes("/shop_pay_logs") ?
			await reportModel.shopPay.findAll({
				include: [{
					as: "account",
					required: false,
					model: accountModel.info
				}],
				offset: 0, limit: 8,
				order: [
					["createdAt", "DESC"]
				]
			}) : [];

		payLogs.forEach(report =>
			payLogsItems.push({
				createdAt: moment(report.get("createdAt")).tz(req.user.tz).format("YYYY-MM-DD HH:mm"),
				accountDBID: report.get("accountDBID"),
				userName: report.get("account")?.get("userName") || "-",
				serverId: report.get("serverId"),
				productId: report.get("productId"),
				price: report.get("price"),
				quantity: report.get("quantity"),
				amount: report.get("price") * report.get("quantity"),
				status: report.get("status"),
				statusString: i18n.__(report.get("status"))
			})
		);

		res.json({
			result_code: 0,
			msg: "success",
			servers: seerversItems,
			isMaintenance: maintenance !== null,
			activityReport: activityReportItems,
			cheatsReport: cheatsReportItems,
			payLogs: payLogsItems
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.getAccounts = ({ logger, sequelize, accountModel }) => [
	apiAccessHandler,
	[query("value").optional({ checkFalsy: true }).isInt()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const accounts = await accountModel.info.findAll({
			offset: 0, limit: 8,
			where: {
				[Op.or]: req.query.value ? [{ accountDBID: req.query.value }] : [
					sequelize.where(sequelize.col("account_info.accountDBID"), Op.like, `%${req.query.query}%`),
					sequelize.where(sequelize.fn("lower", sequelize.col("userName")), Op.like, `%${req.query.query}%`),
					sequelize.where(sequelize.fn("lower", sequelize.col("email")), Op.like, `%${req.query.query}%`),
					{ accountDBID: {
						[Op.in]: (await accountModel.characters.findAll({
							offset: 0, limit: 6,
							where: sequelize.where(sequelize.fn("lower", sequelize.col("name")), Op.like, `%${req.query.query}%`),
							attributes: ["accountDBID"]
						})).map(character => character.get("accountDBID"))
					} }
				]
			},
			include: [{
				as: "character",
				...!req.query.value ? { where: sequelize.where(sequelize.fn("lower", sequelize.col("name")), Op.like, `%${req.query.query}%`) } : [],
				model: accountModel.characters,
				required: false,
				attributes: ["name"]
			}],
			attributes: ["accountDBID", "userName", "email"],
			order: [
				["accountDBID", "ASC"]
			]
		});

		res.json({
			result_code: 0,
			msg: "success",
			suggestions: accounts.map(a => ({
				value: a.accountDBID.toString(),
				data: {
					accountDBID: a.accountDBID,
					userName: a.userName,
					email: a.email,
					character: a.character[0]?.name || ""
				}
			}))
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.getCharacters = ({ logger, sequelize, accountModel }) => [
	apiAccessHandler,
	[query("value").optional({ checkFalsy: true }).isInt()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const accounts = await accountModel.characters.findAll({
			offset: 0, limit: 8,
			where: {
				[Op.or]: req.query.value ? [{ characterId: req.query.value }] : [
					sequelize.where(sequelize.col("characterId"), Op.like, `%${req.query.query}%`),
					sequelize.where(sequelize.fn("lower", sequelize.col("name")), Op.like, `%${req.query.query}%`)
				]
			},
			attributes: ["characterId", "accountDBID", "serverId", "name"]
		});

		res.json({
			result_code: 0,
			msg: "success",
			suggestions: accounts.map(a => ({
				value: a.characterId.toString(),
				data: {
					accountDBID: a.accountDBID,
					serverId: a.serverId,
					name: a.name
				}
			}))
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.getItems = ({ logger, i18n, datasheetModel }) => [
	apiAccessHandler,
	[query("value").optional({ checkFalsy: true }).isInt()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		let queryResult = [];

		if (req.query.value || !isNaN(req.query.query)) {
			const result = datasheetModel.strSheetItem.get(i18n.getLocale())?.getOne(req.query.value || req.query.query);

			if (result) {
				queryResult = [result];
			}
		} else if (req.query.query) {
			queryResult = datasheetModel.strSheetItem.get(i18n.getLocale())?.findAll(req.query.query, { limit: 25 });
		}

		const items = queryResult
			.map(({ itemTemplateId, string, toolTip }) => ({
				...datasheetModel.itemData.get(i18n.getLocale())?.getOne(itemTemplateId),
				string, toolTip
			}))
			.map(itemData => ({
				...itemData,
				itemConversion: (datasheetModel.itemConversion.get(i18n.getLocale())?.getOne(itemData.itemTemplateId) || [])
					.map(({ itemTemplateId }) =>
						datasheetModel.itemData.get(i18n.getLocale())?.getOne(itemTemplateId)
					),
				skillIconData: datasheetModel.skillIconData.get(i18n.getLocale())?.getOne(itemData.linkSkillId)
			}));

		res.json({
			result_code: 0,
			msg: "success",
			suggestions: items.filter(item => item && item.itemTemplateId).map(item => {
				const icons = new Set();

				icons.add(item.icon);

				if (item.itemConversion) {
					item.itemConversion.forEach(data =>
						icons.add(data.icon)
					);
				}

				if (item.skillIconData) {
					icons.add(item.skillIconData.icon);
				}

				return {
					value: item.itemTemplateId.toString(),
					data: {
						title: item.string,
						icon: item.icon,
						rareGrade: item.rareGrade,
						icons: [...icons]
					}
				};
			})
		});
	}
];