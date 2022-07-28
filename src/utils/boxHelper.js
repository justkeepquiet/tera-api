"use strict";

/**
 * @typedef {import("../app").modules} modules
 */

const moment = require("moment");

class ServiceItem {
	/**
	 * @param {modules} modules
	 */
	constructor(modules) {
		this.modules = modules;
	}

	checkCreate(serviceItemId, itemTemplateId, title, description, userSn = 0) {
		if (serviceItemId) {
			return this.checkExists(serviceItemId).then(exists => {
				if (exists) {
					return Promise.resolve(Number(serviceItemId));
				}

				return this.create(itemTemplateId, title, description, userSn).then(newServiceItemId =>
					Promise.resolve(Number(newServiceItemId))
				);
			});
		}

		return this.create(itemTemplateId, title, description, userSn).then(newServiceItemId =>
			Promise.resolve(Number(newServiceItemId))
		);
	}

	create(itemTemplateId, title, description, userSn = 0) {
		const time = moment().utc().format("YYYY-MM-DD HH:mm:ss");
		const tag = "1,1,1";

		return this.modules.hub.createServiceItem(userSn || 0, itemTemplateId, 1, time, true, title, description, tag).then(serviceItemId =>
			Promise.resolve(Number(serviceItemId))
		);
	}

	remove(serviceItemId) {
		return serviceItemId ?
			this.modules.hub.removeServiceItem(serviceItemId) :
			Promise.resolve();
	}

	checkExists(serviceItemId) {
		return this.modules.hub.getServiceItem(serviceItemId).then(resultSet =>
			Promise.resolve(resultSet.length > 0 && !!parseInt(resultSet[0].serviceItemEnableFlag))
		);
	}
}

class Box {
	/**
	 * @param {modules} modules
	 */
	constructor(modules) {
		this.modules = modules;
	}

	create(boxContext, userId, serverId = null, characterId = null, externalTransactionKey = null) {
		const startDate = moment().utc().format("YYYY-MM-DD HH:mm:ss");
		const endDate = moment().utc().add(boxContext.days, "days").format("YYYY-MM-DD HH:mm:ss");

		const itemData = [];
		const boxTagData = [
			{ boxTagSN: 1, boxTagValue: boxContext.content },
			{ boxTagSN: 2, boxTagValue: boxContext.title },
			{ boxTagSN: 3, boxTagValue: boxContext.icon }
		];

		boxContext.items.forEach(item =>
			itemData.push({
				serviceItemSN: item.item_id,
				externalItemKey: 0,
				serviceItemTag: [
					{ serviceItemTagSN: 1, serviceItemTagValue: item.item_count }
				]
			})
		);

		return this.modules.hub.createBox(1, userId, startDate, endDate, true, itemData, boxTagData,
			serverId, characterId, null, null, externalTransactionKey
		);
	}

	notiUser(serverId, userId, characterId = null) {
		return this.modules.hub.boxNotiUser(serverId, userId, characterId || 0);
	}
}

module.exports = { ServiceItem, Box };