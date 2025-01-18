"use strict";

/**
 * @typedef {import("../../app").modules} modules
 */

const { formatStrsheet } = require("../../utils/helpers");
const { ServiceItem, Box } = require("../../utils/boxHelper");

class ItemClaim {
	/**
	 * @param {modules} modules
	 */
	constructor(modules, userId, serverId, params = {}) {
		this.modules = modules;
		this.userId = userId;
		this.serverId = serverId;
		this.params = params;

		this.serviceItem = new ServiceItem(modules);
		this.box = new Box(modules);
	}

	makeBox(context, characterId = null) {
		const promises = [];

		context.items.forEach((item, i) => {
			if (item.item_id || !item.item_template_id) {
				return;
			}

			const modelLocale = this.getModelLocale();
			const itemData = this.modules.datasheetModel.itemData.get(modelLocale)?.getOne(item.item_template_id);

			if (itemData) {
				const strSheetItem = this.modules.datasheetModel.strSheetItem.get(modelLocale)?.getOne(item.item_template_id);
				const title = strSheetItem.string || "undefined";
				const description = formatStrsheet(strSheetItem.toolTip) || "undefined";

				promises.push(this.serviceItem.getCreate(item.item_template_id, title, description).then(serviceItemId => {
					if (serviceItemId) {
						context.items[i].item_id = serviceItemId;
					}
				}));
			} else {
				this.modules.logger.error(`Cannot create Service Item for ItemTemplateId ${item.item_template_id}: non-existent template`);
			}
		});

		return Promise.all(promises).then(() =>
			this.box.create(context, this.userId, this.serverId, characterId, this.params.logId).then(boxId =>
				this.modules.reportModel.boxes.create({
					boxId,
					accountDBID: this.userId,
					serverId: this.serverId,
					characterId: characterId || null,
					logType: this.params.logType || null,
					logId: this.params.logId || null,
					context: JSON.stringify(context)
				}).then(() => {
					this.box.notiUser(this.serverId, this.userId, characterId || 0).catch(err =>
						this.modules.logger.warn(err.toString())
					);

					return Promise.resolve(boxId);
				})
			)
		);
	}

	getModelLocale() {
		if (this.modules.datasheetModel.itemData.has("en")) {
			return "en";
		}

		return Array.from(this.modules.datasheetModel.itemData.keys())[0];
	}
}

module.exports = ItemClaim;