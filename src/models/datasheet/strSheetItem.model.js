"use strict";

const { Index } = require("flexsearch");

class StrSheetAccountBenefitModel {
	constructor() {
		this.data = new Map();
		this.stringIndex = new Index({ preset: "memory" });
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
					string: attributes.string
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

	getOne(id) {
		return this.data.get(Number(id));
	}

	getAll() {
		return this.data;
	}

	findAll(string) {
		return this.stringIndex.search(string).map(id => this.data.get(id));
	}
}

module.exports = StrSheetAccountBenefitModel;