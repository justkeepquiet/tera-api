"use strict";

class StrSheetDungeonModel {
	constructor() {
		this.data = new Map();
	}

	get section() {
		return "StrSheet_Dungeon";
	}

	get bindings() {
		return {
			"/StrSheet_Dungeon/String": ({ attributes }) => {
				this.data.set(attributes.id, {
					id: attributes.id,
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
	}

	getOne(id) {
		return this.data.get(Number(id));
	}

	getAll() {
		return this.data.values();
	}
}

module.exports = StrSheetDungeonModel;