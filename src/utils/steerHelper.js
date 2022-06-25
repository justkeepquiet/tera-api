"use strict";

/**
* @typedef {import("promise-socket").PromiseSocket} PromiseSocket
*/

const struct = require("python-struct");
const { OpMsg } = require("./protobuf/opMsg").op;

class SteerHelper {
	constructor(params) {
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

		this.steerErrorCode = {
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

		this.params = params;
	}

	getErrorCode(resultCode) {
		return this.readGuid(resultCode)?.value;
	}

	/**
	* @param {PromiseSocket} socket
	*/
	sendAndRecv(socket, opMsg) {
		if (this.params.logger?.debug) {
			this.params.logger.debug(`Steer Send: ${JSON.stringify(opMsg)}`);
		}

		const structFormat = ">HII";
		const prefixLength = struct.sizeOf(structFormat);
		const serializedData = OpMsg.encode(opMsg).finish();

		const sendData = Buffer.concat([
			struct.pack(structFormat, serializedData.length + prefixLength, opMsg.senderGusid, opMsg.receiverGusid),
			serializedData
		]);

		return socket.write(sendData).then(() =>
			socket.read().then(data => {
				const responseData = data.slice(prefixLength);
				const unserializedData = OpMsg.decode(responseData);

				if (this.params.logger?.debug) {
					this.params.logger.debug(`Steer Recv: ${JSON.stringify(unserializedData)}`);
				}

				return Promise.resolve(unserializedData);
			})
		);
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

module.exports = SteerHelper;