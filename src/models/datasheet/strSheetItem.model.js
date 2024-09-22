"use strict";

const { Index } = require("flexsearch");

class StrSheetAccountBenefitModel {
	constructor() {
		this.data = new Map();
		this.stringIndex = new Index({
			preset: "memory",
			tokenize: "forward",
			threshold: 0,
			resolution: 3,
			cache: true
		});
	}

	get section() {
		return "StrSheet_Item";
	}

	get bindings() {
		return {
			"/StrSheet_Item/String": ({ attributes }) => {
				this.stringIndex.add(attributes.id, attributes.string);

				this.data.set(attributes.id, {
					itemTemplateId: attributes.id,
					string: attributes.string,
					toolTip: attributes.toolTip
				});
			}
		};
	}

	export() {
		return this.data;
	}

	import(data) {
		this.data = data;

		this.data.forEach(({ itemTemplateId, string }) =>
			this.stringIndex.add(itemTemplateId, string)
		);
	}

	getOne(itemTemplateId) {
		return this.data.get(Number(itemTemplateId));
	}

	getAll() {
		return this.data.values();
	}

	findAll(string, options = {}) {
		return this.stringIndex.search(string, options).map(
			itemTemplateId => this.data.get(itemTemplateId)
		);
	}
}

module.exports = StrSheetAccountBenefitModel;