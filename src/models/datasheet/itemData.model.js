"use strict";

class StrSheetAccountBenefitModel {
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

	getOne(id) {
		return this.data.get(Number(id));
	}

	getAll() {
		return this.data;
	}
}

module.exports = StrSheetAccountBenefitModel;