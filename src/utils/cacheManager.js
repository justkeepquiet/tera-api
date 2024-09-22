"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { encode, decode, ExtensionCodec } = require("@msgpack/msgpack");

const SET_EXT_TYPE = 0;
const MAP_EXT_TYPE = 1;
const extensionCodec = new ExtensionCodec();

extensionCodec.register({
	type: SET_EXT_TYPE,
	encode: object => {
		if (object instanceof Set) {
			return encode([...object]);
		} else {
			return null;
		}
	},
	decode: data => {
		const array = decode(data);
		return new Set(array);
	}
});

extensionCodec.register({
	type: MAP_EXT_TYPE,
	encode: object => {
		if (object instanceof Map) {
			return encode([...object]);
		} else {
			return null;
		}
	},
	decode: data => {
		const array = decode(data);
		return new Map(array);
	}
});

const sha1 = content =>
	crypto.createHash("sha1").update(content).digest("hex")
;

class CacheManager {
	constructor(directoryPath, filePrefix = "", logger = null) {
		this.directoryPath = directoryPath;
		this.filePrefix = filePrefix;
		this.logger = logger;
	}

	read(cacheKey, revision = 0, ttl = 0) {
		const filePath = this.getFilePath(cacheKey);

		if (fs.existsSync(filePath)) {
			const cache = decode(fs.readFileSync(filePath), { extensionCodec });

			if (this.logger) {
				this.logger.debug(`Read cache data for key: ${cacheKey}, rev: ${cache.revision}`);
			}

			if (cache && ((revision !== 0 && revision === cache.revision) || (ttl !== 0 && Date.now() < cache.time + ttl))) {
				return cache.data;
			}
		}

		return null;
	}

	save(cacheKey, data, revision) {
		const filePath = this.getFilePath(cacheKey);
		const serialized = encode({ data, revision, time: Date.now() }, { extensionCodec });

		if (!fs.existsSync(this.directoryPath)) {
			fs.mkdirSync(this.directoryPath, { recursive: true });
		}

		fs.writeFileSync(filePath, serialized);

		if (this.logger) {
			this.logger.debug(`Write cache data for key: ${cacheKey}, rev: ${revision}`);
		}
	}

	getFilePath(cacheKey) {
		return path.join(this.directoryPath, `${this.filePrefix}_${sha1(cacheKey)}.bin`);
	}
}

module.exports = CacheManager;