"use strict";

class StrSheetAccountBenefitModel {
	constructor() {
		this.data = new Map();
	}

	get section() {
		return "StrSheet_Creature";
	}

	get bindings() {
		return {
			"/StrSheet_Creature/HuntingZone": ({ attributes, elements }) => {
				elements.forEach(element => {
					this.data.set(`${attributes.id},${element.attributes.templateId}`, {
						zoneId: attributes.id,
						templateId: element.attributes.templateId,
						name: element.attributes.name
					});
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

	getOne(huntingZoneId, templateId) {
		return this.data.get(`${huntingZoneId},${templateId}`);
	}

	getAll() {
		return this.data.values();
	}
}

module.exports = StrSheetAccountBenefitModel;