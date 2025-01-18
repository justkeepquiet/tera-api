"use strict";

class SkillIconDataModel {
	constructor() {
		this.data = [];
	}

	get section() {
		return "SkillIconData";
	}

	get bindings() {
		return {
			"/SkillIconData/Icon": ({ attributes }) => {
				if (attributes.iconName !== undefined) {
					this.data.push({
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

	getAll() {
		return this.data;
	}
}

module.exports = SkillIconDataModel;