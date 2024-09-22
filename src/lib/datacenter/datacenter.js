"use strict";

class Datacenter {
	constructor(logger = null) {
		this.logger = logger;

		this.elements = { data: [] };
		this.strings = { data: [] };
		this.names = { data: [] };

		this.bindings = {};
	}

	parse(filterKeys = null, bindings = {}) {
		this.bindings = bindings;

		if (this.elements.data.length === 0) {
			throw new "Datacenter: Data is not loaded";
		}

		const time = Date.now();
		const refetence = this.elements.data[0].data[0];

		if (this.logger) {
			this.logger.info(`Datacenter: Begin infer data: children count: ${refetence.childrenCount}`);
		}

		const elements = this.parseElements(refetence, null, "", filterKeys).elements;

		if (this.logger) {
			this.logger.info(`Datacenter: Infer data done took ${((Date.now() - time) / 1000).toFixed(2)}s: ` +
				`sections: ${filterKeys.length}, elements ${elements.length}`
			);
		}

		return elements;
	}

	parseElements(ref, name, pathNodes, filterKeys) {
		const entry = {
			name,
			attributes: this.parseAttributes(ref),
			elements: []
		};

		for (let i = 0; i < ref.childrenCount; i++) {
			const reference = this.elements.data[ref.children[0]].data[ref.children[1] + i];

			if (reference.nameIndex == 0) {
				continue;
			}

			const key = this.getName(reference);

			if (filterKeys !== null && filterKeys.length !== 0 && !filterKeys.includes(key)) {
				continue;
			}

			entry.elements.push(this.parseElements(reference, key, `${pathNodes}/${key}`, null));
		}

		const binding = this.bindings[pathNodes];

		if (typeof binding === "function") {
			binding.call(null, entry);
		}

		return entry;
	}

	parseAttributes(ref) {
		const attributes = {};

		for (let i = 0; i < ref.attributeCount; i++) {
			const reference = this.attributes.data[ref.attributes[0]].data[ref.attributes[1] + i];

			if (reference.nameIndex == 0) {
				continue;
			}

			const key = this.getName(reference);

			if ([1, 2, 5].includes(reference.type)) {
				attributes[key] = reference.value;
			} else {
				attributes[key] = this.getString(reference.value);
			}
		}

		return attributes;
	}

	getName(ref) {
		if (ref.nameIndex === 0) return "__placeholder__";
		const reference = this.names.addresses.data[ref.nameIndex - 1];

		return this.names.map.get(`${reference[0]},${reference[1]}`);
	}

	getString(ref) {
		return this.strings.map.get(`${ref[0]},${ref[1]}`);
	}
}

module.exports = Datacenter;