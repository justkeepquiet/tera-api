const fs = require("fs");
const crypto = require("crypto");
const zlib = require("zlib");

class Packer {
	constructor(key, iv, filePath, isCompressed = true, logger = null) {
		this.key = key;
		this.iv = iv;
		this.filePath = filePath;
		this.isCompressed = isCompressed;
		this.logger = logger;
	}

	unpack() {
		const data = this.read();

		if (this.logger) {
			this.logger.debug(`Packer: Original size: ${data.length}`);
		}

		const decrypted = this.key && this.iv ? this.decrypt(data) : data;

		if (this.isCompressed) {
			const uncompressed = this.inflate(decrypted);

			if (this.logger) {
				this.logger.debug(`Packer: Uncompressed size: ${uncompressed.length}`);
			}

			return uncompressed;
		}

		return decrypted;
	}

	read() {
		return fs.readFileSync(this.filePath);
	}

	decrypt(data) {
		const decipher = crypto.createDecipheriv("aes-128-cfb", Buffer.from(this.key, "hex"), Buffer.from(this.iv, "hex"));
		decipher.setAutoPadding(false);

		const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);

		if (decrypted[4] !== 0x78 || decrypted[5] !== 0x9c) {
			throw "Packer: Invalid Key/IV";
		}

		return decrypted;
	}

	inflate(data) {
		return zlib.inflateSync(data.slice(4));
	}
}

module.exports = Packer;