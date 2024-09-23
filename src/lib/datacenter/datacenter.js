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
			throw "Datacenter: Data is not loaded";
		}

		const time = Date.now();
		const reference = this.elements.data[0].data[0];

		if (this.logger) {
			this.logger.info(`Datacenter: Begin infer data: children count: ${reference.childrenCount}`);
		}

		const elements = this.parseElements(reference, null, "", filterKeys).elements;

		if (this.logger) {
			this.logger.info(`Datacenter: Infer data done took ${((Date.now() - time) / 1000).toFixed(2)}s: ` +
				`sections: ${filterKeys ? filterKeys.length : "all"}, elements ${elements.length}`
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

		const children = ref.children;

		for (let i = 0; i < ref.childrenCount; i++) {
			const reference = this.elements.data[children[0]].data[children[1] + i];

			if (reference.nameIndex === 0) {
				continue;
			}

			const key = this.getName(reference);

			if (filterKeys && filterKeys.length && !filterKeys.includes(key)) {
				continue;
			}

			entry.elements.push(this.parseElements(reference, key, `${pathNodes}/${key}`, null));
		}

		this.applyBinding(pathNodes, entry);

		return entry;
	}

	parseAttributes(ref) {
		const attributes = {};
		const refAttributes = ref.attributes;

		for (let i = 0; i < ref.attributeCount; i++) {
			const reference = this.attributes.data[refAttributes[0]].data[refAttributes[1] + i];

			if (reference.nameIndex === 0) {
				continue;
			}

			const key = this.getName(reference);

			attributes[key] = [1, 2, 5].includes(reference.type)
				? reference.value
				: this.getString(reference.value);
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

	applyBinding(pathNodes, entry) {
		const binding = this.bindings[pathNodes];

		if (typeof binding === "function") {
			binding.call(null, entry);
		}
	}
}

module.exports = Datacenter;