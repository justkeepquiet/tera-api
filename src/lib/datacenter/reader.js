/* eslint-disable no-param-reassign */
"use strict";

/**
 * @typedef {import("./datacenter")} Datacenter
 */

const REFERENCE_TIMESTAMP = -1.0;

class Reader {
	constructor(padding = true, logger = null) {
		this.padding = padding;
		this.logger = logger;
		this.buffer = null;
		this.offset = 0;
	}

	/**
	 * @param {Buffer} buffer
	 * @param {Datacenter} datacenter
	 * @param {string[]} mapStrings
	 */
	read(buffer, datacenter = {}, mapStrings = ["Strings", "Names"]) {
		this.buffer = buffer;
		this.offset = 0;

		const time = Date.now();

		if (this.logger) {
			this.logger.info(`Reader: Begin reading with raw size: ${this.buffer.length}`);
			this.logger.debug(`Reader: Reading header data at offset: ${this.offset}`);
		}

		datacenter.header = this.readHeader();

		if (this.logger) {
			this.logger.debug(`Reader: Reading keys data at offset: ${this.offset}`);
		}

		datacenter.keys = this.readRegion({ reader: this.readKeys.bind(this) });

		if (this.logger) {
			this.logger.debug(`Reader: Reading attributes data at offset: ${this.offset}`);
		}

		datacenter.attributes = this.readRegion({
			reader: this.readRegion.bind(this),
			options: {
				reader: this.readAttributes.bind(this),
				writeActual: true
			}
		});

		if (this.logger) {
			this.logger.debug(`Reader: Reading elements data at offset: ${this.offset}`);
		}

		datacenter.elements = this.readRegion({
			reader: this.readRegion.bind(this),
			options: {
				reader: this.readElements.bind(this),
				writeActual: true
			}
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
			throw new Error(`Reader: ${this.buffer.length - this.offset} bytes left`);
		}

		if (this.logger) {
			this.logger.info(`Reader: Reading done took ${((Date.now() - time) / 1000).toFixed(2)}s: ` +
				`ver: ${datacenter.header.version}, ` +
				`rev: ${datacenter.header.revision}, ` +
				`elements: ${datacenter.elements.data.length}, ` +
				`strings: ${datacenter.strings.addresses.size}, ` +
				`names: ${datacenter.names.addresses.size}`
			);
		}

		return datacenter;
	}

	readHeader() {
		const version = this.readUInt32();

		if (version !== 3 && version !== 6) {
			throw `Reader: Unsupported version: ${version}`;
		}

		const timestamp = this.readUInt64();

		if (timestamp !== REFERENCE_TIMESTAMP && this.logger) {
			this.logger.warn(`Reader: Unknown timestamp: ${timestamp}`);
		}

		const revision = version === 6 ? this.readUInt32() : null;

		const unk1 = this.readUInt16();
		const unk2 = this.readUInt16();
		const unk3 = this.readUInt32();
		const unk4 = this.readUInt32();
		const unk5 = this.readUInt32();

		return { version, timestamp, revision, unk1, unk2, unk3, unk4, unk5 };
	}

	readKeys() {
		return [this.readUInt32(), this.readUInt32()];
	}

	readAddress() {
		return [this.readUInt16(), this.readUInt16()];
	}

	readAttributes() {
		const nameIndex = this.readUInt16();
		const type = this.readUInt16();
		let value = null;

		if (type === 1) {
			value = this.readUInt32();
		} else if (type === 2) {
			value = this.readFloat();
		} else if (type === 5) {
			value = this.readUInt32();
			if (value !== 0 && value !== 1) {
				throw `Reader: Attribute not a bool, value: ${value}`;
			}
			value = Boolean(value);
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
		const index = this.readUInt16();
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

		return { nameIndex, index, attributeCount, childrenCount, attributes, children };
	}

	readStringRegion(size, mapStrings) {
		const values = this.readRegion({ reader: this.readString.bind(this) });
		const info = this.readRegion({
			reader: this.readRegion.bind(this),
			options: { reader: this.readStringInfo.bind(this) },
			size,
			writeSize: false
		});
		const addresses = this.readRegion({
			reader: this.readAddress.bind(this),
			offsetAdjustment: -1
		});

		let map = new Map();

		if (mapStrings) {
			map = this.mapStrings(values.data);
		}

		return { values, info, addresses, map };
	}

	readString() {
		const size = this.readUInt32();
		const used = this.readUInt32();
		const value = this.readBuffer(size * 2).toString("ucs2");

		return { size, used, value };
	}

	readStringInfo() {
		const hash = this.readUInt32();
		const length = this.readUInt32();
		const id = this.readUInt32();
		const address = this.readAddress();

		return { hash, length, id, address };
	}

	readFooter() {
		if (this.buffer.length === this.offset) {
			if (this.logger) {
				this.logger.warn("Reader: Missing Footer!");
			}

			return { marker: 0 };
		}

		return { marker: this.readUInt32() };
	}

	readRegion({ reader, options = {}, size = 0, offsetAdjustment = 0, writeSize = true, writeActual = false }) {
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
			items.push(reader(options));
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
		const data = this.buffer.subarray(this.offset, this.offset + length);
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

	readUInt64() {
		const value = this.buffer.readDoubleLE(this.offset);
		this.offset += 8;

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