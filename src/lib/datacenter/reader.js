/* eslint-disable no-param-reassign */
"use strict";

class Reader {
	constructor(padding = true, logger = null) {
		this.padding = padding;
		this.logger = logger;

		this.buffer = null;
		this.offset = 0;

		this.TypeCode = new Map([
			[1, () => this.readUInt32()],
			[2, () => this.readFloat()],
			[5, () => {
				const value = this.readUInt32();

				if (value !== 0 && value !== 1) {
					throw `Reader: Attribute not a bool, value: ${value}`;
				}

				return Boolean(value);
			}]
		]);
	}

	read(buffer, datacenter = {}, mapStrings = ["Strings", "Names"]) {
		this.buffer = buffer;
		this.offset = 0;

		const time = Date.now();

		if (this.logger) {
			this.logger.info(`Reader: Begin reading with raw length: ${this.buffer.length}`);
			this.logger.debug(`Reader: Reading header data at offset: ${this.offset}`);
		}
		datacenter.header = this.readHeader();

		if (this.logger) {
			this.logger.debug(`Reader: Reading unknown data at offset: ${this.offset}`);
		}
		datacenter.unk1 = this.readRegion({ type: "Unk1" });

		if (this.logger) {
			this.logger.debug(`Reader: Reading attributes data at offset: ${this.offset}`);
		}
		datacenter.attributes = this.readRegion({
			type: "Region",
			options: { type: "Attributes", writeActual: true }
		});

		if (this.logger) {
			this.logger.debug(`Reader: Reading elements data at offset: ${this.offset}`);
		}
		datacenter.elements = this.readRegion({
			type: "Region",
			options: { type: "Elements", writeActual: true }
		});

		if (this.logger) {
			this.logger.debug(`Reader: Reading strings data at offset: ${this.offset}`);
		}
		datacenter.strings = this.readStringRegion(1024, mapStrings.includes("Strings"));

		if (this.logger) {
			this.logger.debug(`Reader: Reading names data at offset: ${this.offset}`);
		}
		datacenter.names = this.readStringRegion(512, mapStrings.includes("Names"));

		if (this.logger) {
			this.logger.debug(`Reader: Reading footer data at offset: ${this.offset}`);
		}
		datacenter.footer = this.readFooter();

		if (this.buffer.length !== this.offset) {
			throw new Error(`${this.buffer.length - this.offset} bytes left`);
		}

		if (this.logger) {
			this.logger.info(`Reader: Reading done took ${((Date.now() - time) / 1000).toFixed(2)}s: ` +
				`version: ${datacenter.header.version}, ` +
				`elements: ${datacenter.elements.data.length}, ` +
				`strings: ${datacenter.strings.addresses.size}, ` +
				`names: ${datacenter.names.addresses.size}`
			);
		}

		return datacenter;
	}

	readHeader() {
		return {
			unk1: this.readUInt32(),
			unk2: this.readUInt32(),
			unk3: this.readUInt32(),
			version: this.readUInt32(),
			unk4: this.readUInt32(),
			unk5: this.readUInt32(),
			unk6: this.readUInt32(),
			unk7: this.readUInt32()
		};
	}

	readUnk1() {
		return [this.readUInt32(), this.readUInt32()];
	}

	readAddress() {
		return [this.readUInt16(), this.readUInt16()];
	}

	readAttributes() {
		const nameIndex = this.readUInt16();
		const type = this.readUInt16();
		let value = null;

		if (this.TypeCode.has(type)) {
			value = this.TypeCode.get(type)();
		} else {
			value = this.readAddress();
		}

		if (this.padding) {
			this.offset += 4;
		}

		return { nameIndex, type, value };
	}

	readElements() {
		const nameIndex = this.readUInt16();
		const unk1 = this.readUInt16();
		const attributeCount = this.readUInt16();
		const childrenCount = this.readUInt16();
		const attributes = this.readAddress();

		if (this.padding) {
			this.offset += 4;
		}

		const children = this.readAddress();

		if (this.padding) {
			this.offset += 4;
		}

		return {
			nameIndex,
			unk1,
			attributeCount,
			childrenCount,
			attributes,
			children
		};
	}

	readStringRegion(size, mapStrings) {
		const values = this.readRegion({ type: "String" });
		const metadata = this.readRegion({
			type: "Region",
			options: { type: "Meta" },
			size,
			writeSize: false
		});
		const addresses = this.readRegion({
			type: "Address",
			offsetAdjustment: -1
		});

		let map = new Map();

		if (mapStrings) {
			map = this.mapStrings(values.data);
		}

		return { values, metadata, addresses, map };
	}

	readString() {
		const size = this.readUInt32();
		const used = this.readUInt32();
		const value = this.readBuffer(size * 2).toString("ucs2");

		return { size, used, value };
	}

	readMeta() {
		const unk1 = this.readUInt32();
		const length = this.readUInt32();
		const id = this.readUInt32();
		const address = this.readAddress();

		return { unk1, length, id, address };
	}

	readFooter() {
		if (this.buffer.length === this.offset) {
			this.logger.warn("Reader: Missing Footer!");

			return { unk1: 0 };
		}

		return { unk1: this.readUInt32() };
	}

	readRegion({ type, options = {}, size = 0, offsetAdjustment = 0, writeSize = true, writeActual = false }) {
		const data = {};

		if (writeSize) {
			size = this.readUInt32();
		}

		if (writeActual) {
			data.actual = this.readUInt32();
		}

		size += offsetAdjustment;
		const items = [];

		for (let i = 0; i < size; i++) {
			items.push(this[`read${type}`](options));
		}

		if (writeSize) {
			data.size = size;
		}

		if (items.length) {
			data.data = items;
		}

		return data;
	}

	readBuffer(length) {
		const data = this.buffer.slice(this.offset, this.offset + length);
		this.offset += length;

		return data;
	}

	readFloat() {
		const value = this.buffer.readFloatLE(this.offset);
		this.offset += 4;

		return value;
	}

	readUInt16() {
		const value = this.buffer.readUInt16LE(this.offset);
		this.offset += 2;

		return value;
	}

	readUInt32() {
		const value = this.buffer.readUInt32LE(this.offset);
		this.offset += 4;

		return value;
	}

	mapStrings(dataArray) {
		const map = new Map();

		dataArray.forEach((item, index) => {
			const strings = item.value.split("\0");
			let offset = 0;

			strings.forEach((str) => {
				map.set(`${index},${offset}`, str);
				offset += str.length + 1;
			});
		});

		return map;
	}
}

module.exports = Reader;