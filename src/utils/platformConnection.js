"use strict";

const net = require("net");
const PromiseSocket = require("promise-socket").PromiseSocket;
const struct = require("python-struct");
const OpMsg = require("./protobuf/opMsg").op.OpMsg;

class PlatformConnection {
	constructor(platformAddr, platformPort, params) {
		this.gusid = {
			boxapi: (16 << 24) + 1,
			steersesion: (10 << 24) + 0,
			steermind: (4 << 24) + 0
		};

		this.serverType = {
			unknown: 254,
			all: 255,
			arbitergw: 0,
			steerweb: 1,
			steergw: 2,
			steerhub: 3,
			steermind: 4,
			steerdb: 5,
			gas: 6,
			glogdb: 7,
			steerclient: 8,
			steercast: 9,
			steersession: 10,
			gameadmintool: 11,
			steerbridge: 12,
			hubgw: 13,
			cardmaker: 14,
			carddealer: 15,
			boxapi: 16,
			boxdm: 17,
			dbgw: 18,
			webcstool: 19,
			cardsteerbridge: 20,
			cardweb: 21,
			carddb: 22,
			boxdb: 23,
			boxbridgedorian: 24,
			scstool: 25,
			boxweb: 26,
			cardbridgenetmoderator: 27,
			dicedb: 31,
			dice: 32,
			diceweb: 33,
			steereye: 35
		};

		this.platformErrorCode = {
			success: 0,
			requestfail: 1,
			unknownerror: 2,
			accessdenied: 3,
			notconnected: 4,
			timeout: 5,
			unknownfunction: 6,
			nodata: 7,
			dbdupkey: 8,
			invalidcallee: 9,
			userlogined: 10,
			invalidsession: 11,
			sessiontimeout: 12,
			memcachederror: 13,
			invalidexectype: 14,
			dboperationfail: 15,
			invalidstate: 16
		};

		this.platformAddr = platformAddr;
		this.platformPort = platformPort;
		this.params = params;
	}

	sendAndRecv(opMsg, msgId = 1) {
		if (this.params.logger?.debug) {
			this.params.logger.debug(`Platform Send: ${JSON.stringify(opMsg)}`);
		}

		const socket = new PromiseSocket(new net.Socket());

		socket.socket.on("error", err => {
			if (this.params.logger?.error) {
				this.params.logger.error(`Platform Error: ${err.toString()}`);
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
			struct.pack(destFormat, this.gusid.boxapi),
			struct.pack(idFormat, msgId),
			serializedData
		]);

		return socket.connect(this.platformPort, this.platformAddr).then(() =>
			socket.write(sendData).then(() =>
				socket.read().then(data => {
					socket.destroy();

					const responseData = data.slice(sizeSize + idSize);
					const unserializedData = OpMsg.decode(responseData);

					if (this.params.logger?.debug) {
						this.params.logger.debug(`Platform Recv: ${JSON.stringify(unserializedData)}`);
					}

					return Promise.resolve(unserializedData);
				})
			)
		);
	}

	getErrorCode(resultCode) {
		return this.readGuid(resultCode)?.value;
	}

	makeGuid(cat, num) {
		let category = parseInt(cat);
		let number = parseInt(num);

		return (category &= 0x000000FF) << 24 | (number &= 0x00FFFFFF);
	}

	readGuid(guid) {
		const serverType = parseInt(guid) >> 24;
		const value = parseInt(guid) & 0x00FFFFFF;

		return { serverType, value };
	}
}

module.exports = PlatformConnection;