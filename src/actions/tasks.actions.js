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
			throw Error(`TasksActions: Cannot find PlanetDB instance for server ID: ${serverId}`);
		}

		const usersTotalCount = await planetDb.model.users.count({
			distinct: true,
			col: "accountDBID"
		});

		if (usersTotalCount !== null) {
			await this.modules.serverModel.info.update({
				usersTotal: usersTotalCount
			}, {
				where: { serverId }
			});
		}

		const usersCharacters = await planetDb.model.users.findAll({
			where: {
				deletionStatus: 0,
				class: { [Op.lte]: 12 } // server can set class 13, ignore it
			}
		});

		if (usersCharacters !== null) {
			await this.modules.sequelize.transaction(async () => {
				await this.modules.accountModel.characters.destroy({
					where: { serverId }
				});

				for (const character of usersCharacters) {
					await this.modules.accountModel.characters.create({
						characterId: character.get("userDBID"),
						serverId,
						accountDBID: character.get("accountDBID"),
						name: character.get("userName"),
						classId: character.get("class"),
						genderId: character.get("gender"),
						raceId: character.get("race"),
						level: character.get("userLevel")
					});
				}
			});
		}

		const usersOnline = await planetDb.model.users.findAll({
			where: {
				loginStatus: 1
			}
		});

		if (usersOnline !== null) {
			await this.modules.sequelize.transaction(async () => {
				await this.modules.accountModel.online.destroy({
					where: { serverId }
				});

				for (const user of usersOnline) {
					await this.modules.accountModel.online.create({
						accountDBID: user.get("accountDBID"),
						serverId
					});
				}

				await this.modules.serverModel.info.update({
					usersOnline: usersOnline?.length
				}, {
					where: { serverId }
				});
			});
		}
	}
}

module.exports = TasksActions;