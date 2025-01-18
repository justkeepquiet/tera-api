"use strict";

class ItemConversionModel {
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
							itemTemplateId: element.attributes.templateId,
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

	getOne(itemTemplateId) {
		return this.data.get(Number(itemTemplateId));
	}

	getAll() {
		return this.data.values();
	}
}

module.exports = ItemConversionModel;