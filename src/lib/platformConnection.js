"use strict";

const net = require("net");
const uuid = require("uuid").v4;
const PromiseSocket = require("promise-socket").PromiseSocket;
const struct = require("python-struct");
const OpMsg = require("./protobuf/opMsg").op.OpMsg;
const PlatformError = require("./platformError");
const { readGuid } = require("./teraPlatformGuid");

class PlatformConnection {
	constructor(platformAddr, platformPort, params) {
		this.platformResultCode = {
			success: 0
		};

		this.connectTimeout = 5000;
		this.platformAddr = platformAddr;
		this.platformPort = platformPort;
		this.params = params;
	}

	sendAndRecv(opMsg, gusid, msgId = 1) {
		const id = uuid();

		if (this.params.logger?.debug) {
			this.params.logger.debug(`Send (${id}): ${JSON.stringify(opMsg)}`);
		}

		const socket = new PromiseSocket(new net.Socket());

		socket.setTimeout(this.connectTimeout);
		socket.socket.on("error", err => {
			if (this.params.logger?.error) {
				this.params.logger.error(err.toString());
			}
		});

		const sizeFormat = "H";
		const destFormat = "I";
		const idFormat = "H";
		const sizeSize = struct.sizeOf(sizeFormat);
		const destSize = struct.sizeOf(destFormat);
		const idSize = struct.sizeOf(idFormat);

		const serializedData = OpMsg.encode(opMsg).finish();
		const msgSize = sizeSize + destSize + idSize + serializedData.length;

		const sendData = Buffer.concat([
			struct.pack(sizeFormat, msgSize),
			struct.pack(destFormat, gusid),
			struct.pack(idFormat, msgId),
			serializedData
		]);

		return socket.connect(this.platformPort, this.platformAddr).then(() =>
			socket.write(sendData).then(() =>
				socket.read().then(data => {
					socket.destroy();

					if (data === undefined || data.length === 0) {
						return Promise.reject(new PlatformError("Receive failed (receiver down?)", 4));
					}

					const responseData = data.slice(sizeSize + idSize);
					const unserializedData = OpMsg.decode(responseData);

					if (this.params.logger?.debug) {
						this.params.logger.debug(`Recv (${id}): ${JSON.stringify(unserializedData)}`);
					}

					return Promise.resolve(unserializedData);
				})
			)
		).catch(err =>
			Promise.reject(new PlatformError(`Send failed: ${err}`, 4))
		);
	}

	getErrorCode(resultCode) {
		return readGuid(resultCode)?.number;
	}
}

module.exports = PlatformConnection;