"use strict";

class StrSheetAccountBenefitModel {
	constructor() {
		this.data = new Map();
	}

	get section() {
		return "SkillIconData";
	}

	get bindings() {
		return {
			"/SkillIconData/Icon": ({ attributes }) => {
				this.data.set(attributes.skillId, {
					skillId: attributes.skillId,
					class: attributes.class.toLowerCase(),
					race: attributes.race.toLowerCase(),
					gender: attributes.gender.toLowerCase(),
					icon: attributes.iconName.split(".").at(-1).toLowerCase()
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

	getOne(skillId) {
		return this.data.get(Number(skillId));
	}

	getAll() {
		return this.data.values();
	}
}

module.exports = StrSheetAccountBenefitModel;