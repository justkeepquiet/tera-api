"use strict";

class SkillIconDataModel {
	constructor() {
		this.data = new Map();
	}

	get section() {
		return "SkillIconData";
	}

	get bindings() {
		return {
			"/SkillIconData/Icon": ({ attributes }) => {
				if (attributes.iconName !== undefined) {
					const id = [attributes.skillId, attributes.class, attributes.race, attributes.gender].join("-");

					this.data.set(id, {
						skillId: attributes.skillId,
						class: attributes.class.toLowerCase(),
						race: attributes.race.toLowerCase(),
						gender: attributes.gender.toLowerCase(),
						icon: attributes.iconName.split(".").at(-1).toLowerCase()
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

	getOne(skillId, class_, race, gender) {
		return this.data.get([skillId, class_, race, gender].join("-"));
	}

	getAll() {
		return this.data.values();
	}
}

module.exports = SkillIconDataModel;