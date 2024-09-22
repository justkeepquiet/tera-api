"use strict";

class StrSheetAccountBenefitModel {
	constructor() {
		this.data = new Map();
	}

	get section() {
		return "StrSheet_AccountBenefit";
	}

	get bindings() {
		return {
			"/StrSheet_AccountBenefit/String": ({ attributes }) => {
				if (attributes.id < 1999) {
					this.data.set(attributes.id, {
						id: attributes.id,
						string: attributes.string
					});
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
		return this.data.values();
	}
}

module.exports = StrSheetAccountBenefitModel;