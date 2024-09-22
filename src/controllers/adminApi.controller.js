"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 * @typedef {import("express").ErrorRequestHandler} ErrorRequestHandler
 */

const moment = require("moment-timezone");
const query = require("express-validator").query;
const Op = require("sequelize").Op;

const helpers = require("../utils/helpers");
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
module.exports.homeStats = ({ i18n, datasheetModel, dataModel, serverModel, accountModel, reportModel }) => [
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
				offset: 0, limit: 6,
				order: [
					["reportTime", "DESC"]
				]
			}) : [];

		activityReport.forEach(report =>
			activityReportItems.push({
				reportTime: moment(report.get("reportTime")).tz(req.user.tz).format("YYYY-MM-DD HH:mm"),
				reportType: report.get("reportType") == 2 ?
					`${i18n.__("Leave game")} (${helpers.secondsToDhms(i18n.__, report.get("playTime"))})` :
					i18n.__("Enter game"),
				ip: report.get("ip"),
				accountDBID: report.get("accountDBID"),
				serverId: report.get("serverId")
			})
		);

		const cheatsReport = !isSteer || Object.values(req.user.functions).includes("/report_cheats") ?
			await reportModel.cheats.findAll({
				offset: 0, limit: 6,
				order: [
					["reportTime", "DESC"]
				]
			}) : [];

		/*
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
			const [account, name, a, b, skillId] = report.get("cheatInfo").split(",");
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
						return dataModel.skillIcons.findOne({
							where: { skillId, class: classIds[chatacter.get("classId")] }
						}).then(skill =>
							cachedSkills.set(key, skill);
						);
					}
				}));
			}
		});

		await Promise.all(charactersPromises);
		console.log(cachedSkills.entries());
		*/

		cheatsReport.forEach(report => {
			const [account, name, a, b, skillId, zoneId, x, y, z, huntingZoneId, templateId] = report.get("cheatInfo").split(",");

			const dungeon = datasheetModel.strSheetDungeon[i18n.getLocale()]?.getOne(huntingZoneId);
			const creature = datasheetModel.strSheetCreature[i18n.getLocale()]?.getOne(huntingZoneId, templateId);

			cheatsReportItems.push({
				reportTime: moment(report.get("reportTime")).tz(req.user.tz).format("YYYY-MM-DD HH:mm"),
				accountDBID: report.get("accountDBID"),
				name,
				skill: `${skillId} ${a}/${b}`,
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
				offset: 0, limit: 8,
				order: [
					["createdAt", "DESC"]
				]
			}) : [];

		payLogs.forEach(report =>
			payLogsItems.push({
				createdAt: moment(report.get("createdAt")).tz(req.user.tz).format("YYYY-MM-DD HH:mm"),
				accountDBID: report.get("accountDBID"),
				serverId: report.get("serverId"),
				productId: report.get("productId"),
				price: report.get("price"),
				status: report.get("status"),
				statusString: i18n.__(report.get("status"))
			})
		);

		res.json({
			result_code: 0,
			msg: "success",
			servers: seerversItems,
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
module.exports.getItems = ({ logger, i18n, sequelize, dataModel }) => [
	apiAccessHandler,
	[query("value").optional({ checkFalsy: true }).isInt()],
	validationHandler(logger),
	/**
	 * @type {RequestHandler}
	 */
	async (req, res, next) => {
		const searchParts = req.query.query ? req.query.query.replace(/[-_+:\\"\\']/g, " ").split(" ") : [];

		const items = await dataModel.itemStrings.findAll({
			offset: 0, limit: 8,
			where: {
				[Op.or]: req.query.value ? [{ itemTemplateId: req.query.value }] : [
					sequelize.where(sequelize.col("template.itemTemplateId"), Op.like, `%${req.query.query}%`),
					{ [Op.and]: searchParts.map(s => sequelize.where(sequelize.fn("lower", sequelize.col("string")), Op.like, `%${s}%`)) }
				],
				language: i18n.getLocale()
			},
			include: [
				{
					as: "template",
					model: dataModel.itemTemplates,
					required: true,
					attributes: ["icon", "rareGrade", "linkSkillId"],
					include: [
						{
							as: "conversion",
							model: dataModel.itemConversions,
							include: [{
								as: "template",
								model: dataModel.itemTemplates
							}],
							required: false
						},
						{
							as: "skillIcon",
							model: dataModel.skillIcons,
							required: false
						}
					]
				}
			],
			attributes: ["itemTemplateId", "string"]
		});

		res.json({
			result_code: 0,
			msg: "success",
			suggestions: items.map(item => {
				const icons = new Set();

				if (item) {
					icons.add(item.template.icon);
					item.template.conversion.forEach(conversion =>
						icons.add(conversion.template.icon)
					);
					item.template.skillIcon.forEach(skillIcon =>
						icons.add(skillIcon.icon)
					);
				}

				return {
					value: item.itemTemplateId.toString(),
					data: {
						title: item.string,
						icon: item.template.icon,
						rareGrade: item.template.rareGrade,
						icons: [...icons]
					}
				};
			})
		});
	}
];