"use strict";

class ItemDataModel {
	constructor() {
		this.data = new Map();
	}

	get section() {
		return "ItemData";
	}

	get bindings() {
		return {
			"/ItemData/Item": ({ attributes }) => {
				this.data.set(attributes.id, {
					itemTemplateId: attributes.id,
					name: attributes.name || null,
					category: attributes.category || null,
					linkSkillId: attributes.linkSkillId || null,
					linkSkillPeriodDay: attributes.linkSkillPeriodDay || null,
					icon: attributes.icon.split(".").at(-1).toLowerCase(),
					maxStack: attributes.maxStack,
					rareGrade: attributes.rareGrade,
					requiredLevel: attributes.requiredLevel || null,
					requiredClass: attributes.requiredClass?.toLowerCase() || null,
					requiredGender: attributes.requiredGender?.toLowerCase() || null,
					requiredRace: attributes.requiredRace?.toLowerCase() || null,
					boundType: attributes.boundType?.toLowerCase() || null,
					tradable: attributes.tradable,
					periodByWebAdmin: attributes.periodByWebAdmin || null,
					periodInMinute: attributes.periodInMinute || null,
					warehouseStorable: attributes.warehouseStorable
				});
			}
		};
	}

	export() {
		return this.data;
	}

	import(data) {
		this.data = data;
	}

	getOne(itemTemplateId) {
		return this.data.get(Number(itemTemplateId));
	}

	getAll() {
		return this.data.values();
	}
}

module.exports = ItemDataModel;