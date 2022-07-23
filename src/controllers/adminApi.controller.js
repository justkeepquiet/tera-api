"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const moment = require("moment-timezone");

const { resultJson } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.notifications = ({ logger, queue }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		if (!req.isAuthenticated()) {
			return resultJson(res, 3, { msg: "access denied" });
		}

		queue.findByStatus(queue.status.rejected, 6).then(tasks => {
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

			resultJson(res, 0, { msg: "success", count: items.length, items });
		}).catch(err => {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.homeStats = ({ i18n, logger, datasheetModel, serverModel, reportModel }) => [
	/**
	 * @type {RequestHandler}
	 */
	async (req, res) => {
		if (!req.isAuthenticated()) {
			return resultJson(res, 3, { msg: "access denied" });
		}

		const isSteer = req.user.type === "steer";

		try {
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
						(server.get("usersOnline") / server.get("tresholdMedium")) * 100
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
						`${i18n.__("Leave game")} (${(report.get("playTime") / 60).toFixed(2)} ${i18n.__("min.")})` :
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

			cheatsReport.forEach(report => {
				const [account, name, a, b, skill, zoneId, x, y, z, huntingZoneId, templateId] = report.get("cheatInfo").split(",");

				const dungeon = datasheetModel.strSheetDungeon[i18n.getLocale()].get(Number(huntingZoneId));
				const creature = datasheetModel.strSheetCreature[i18n.getLocale()].find(
					c => c.huntingZoneId == huntingZoneId && c.templateId == templateId
				);

				cheatsReportItems.push({
					reportTime: moment(report.get("reportTime")).tz(req.user.tz).format("YYYY-MM-DD HH:mm"),
					accountDBID: report.get("accountDBID"),
					name,
					skill: `${skill} ${a}/${b}`,
					dungeon: `(${huntingZoneId}) ${dungeon || huntingZoneId}`,
					creature: `(${templateId}) ${creature.name || templateId}`,
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

			resultJson(res, 0, {
				msg: "success",
				servers: seerversItems,
				activityReport: activityReportItems,
				cheatsReport: cheatsReportItems,
				payLogs: payLogsItems
			});
		} catch (err) {
			logger.error(err);
			resultJson(res, 1, { msg: "internal error" });
		}
	}
];