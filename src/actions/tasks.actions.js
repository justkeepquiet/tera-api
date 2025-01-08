"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const Op = require("sequelize").Op;
const Box = require("../utils/boxHelper").Box;

class TasksActions {
	/**
	 * @param {modules} modules
	 */
	constructor(modules) {
		this.modules = modules;

		this.box = new Box(modules);
	}

	async createBox(context, userId, serverId = null, characterId = null, lastLoginServer = null, logId = null, logType = null) {
		const boxId = await this.box.create(context, userId, serverId, characterId, logId);

		if (lastLoginServer !== null) {
			this.box.notiUser(lastLoginServer, userId, characterId || 0).catch(err =>
				this.modules.logger.warn(err.toString())
			);
		}

		return await this.modules.reportModel.boxes.create({
			boxId,
			accountDBID: userId,
			serverId: serverId || null,
			characterId: characterId || null,
			logType: logType || null,
			logId: logId || null,
			context: JSON.stringify(context)
		});
	}

	async charactersMigrate(serverId) {
		const planetDb = this.modules.planetDbs?.get(Number(serverId));

		if (!planetDb) {
			throw Error(`Cannot find PlanetDB instance for server ID: ${serverId}`);
		}

		const users = await planetDb.model.users.findAll({
			where: {
				deletionStatus: 0,
				class: { [Op.lte]: 12 } // server can set class 13, ignore it
			}
		});

		await this.modules.sequelize.transaction(async () => {
			await this.modules.accountModel.characters.destroy({
				where: { serverId }
			});

			for (const user of users) {
				await this.modules.accountModel.characters.create({
					characterId: user.get("userDBID"),
					serverId,
					accountDBID: user.get("accountDBID"),
					name: user.get("userName"),
					classId: user.get("class"),
					genderId: user.get("gender"),
					raceId: user.get("race"),
					level: user.get("userLevel")
				});
			}

			await this.modules.serverModel.info.update({ usersTotal: users.length }, {
				where: { serverId }
			});
		});
	}
}

module.exports = TasksActions;