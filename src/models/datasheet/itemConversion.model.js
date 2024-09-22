"use strict";

class StrSheetAccountBenefitModel {
	constructor() {
		this.data = new Map();
	}

	get section() {
		return "ItemConversion";
	}

	get bindings() {
		return {
			"/ItemConversion/SeedItem": ({ attributes, elements }) => {
				const conversions = [];

				elements.forEach(element => {
					if (element.attributes?.templateId) {
						conversions.push({
							templateId: element.attributes.templateId,
							class: element.attributes?.class || null,
							gender: element.attributes?.gender || null,
							race: element.attributes?.race || null
						});
					}
				});

				if (conversions.length) {
					this.data.set(attributes.itemTemplateId, conversions);
				}
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