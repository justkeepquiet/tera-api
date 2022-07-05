/* eslint-disable no-empty-function */
"use strict";

const net = require("net");
const PromiseSocket = require("promise-socket").PromiseSocket;
const struct = require("python-struct");
const OpMsg = require("./protobuf/opMsg").op.OpMsg;
const SteerError = require("./steerError");

class SteerConnection {
	constructor(steerAddr, steerPort, params) {
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

		this.socket = new PromiseSocket(new net.Socket());

		this.readTimeout = 5000;
		this.connected = false;
		this.registred = false;
		this.biasCount = 0;
		this.uniqueServerId = 0;
		this.reconnectInterval = null;
		this.steerAddr = steerAddr;
		this.steerPort = steerPort;
		this.params = params;
		this.readTimer = null;

		this.socket.socket.on("error", err => {

			if (this.params.logger?.error) {
				this.params.logger.error(`Steer Error: ${err.toString()}`);
			}

			if (err.code === "ECONNRESET") {
				this.connected = false;
				this.registred = false;

				this.reconnect();
			}

			clearTimeout(this.readTimer);
		});
	}

	get isConnected() {
		return this.connected;
	}

	get isRegistred() {
		return this.registred;
	}

	connect() {
		clearInterval(this.reconnectInterval);
		this.reconnectInterval = setInterval(() => this.reconnect(), 10000);

		return this.socket.connect(this.steerPort, this.steerAddr).then(() => {
			this.connected = true;
			return this.checkRegistered();
		});
	}

	reconnect() {
		if (!this.connected) {
			this.connect().catch(() => {});
		}
	}

	destroy() {
		this.connected = false;
		this.registred = false;

		return this.socket.destroy();
	}

	checkRegistered() {
		if (!this.connected || this.registred) {
			return Promise.resolve();
		}

		const localEndpoint = `${this.socket.socket.localAddress}:${this.socket.socket.localPort}`.split(/:|\./);

		if (localEndpoint.length > 3) {
			const num = (parseInt(localEndpoint[2]) & 255) << 8;
			const num2 = parseInt(localEndpoint[3]) & 255;
			const num3 = (this.biasCount & 255) << 16;

			this.uniqueServerId = (num | num2 | num3);
		}

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.steerhub, 20), // checkRegister
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
			receiverGusid: this.makeGuid(this.serverType.steerhub, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,
			jobId: 1
		});

		return this.sendAndRecv(opMsg).then(data => {
			if (data.resultCode && this.getErrorCode(data.resultCode) === this.steerErrorCode.success) {
				if (this.params.logger?.info) {
					this.params.logger.info(`Steer Registred: category ${this.serviceId}, number ${this.uniqueServerId}`);
				}

				this.registred = true;
			} else {
				this.biasCount++;

				if (this.biasCount > 10000) {
					return Promise.reject(new SteerError("Steer Error: can't register server", 2));
				}

				this.connect();
			}
		});
	}

	sendAndRecv(opMsg) {
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

		clearTimeout(this.readTimer);

		this.readTimer = setTimeout(() => {
			this.socket.end();
			this.destroy();
		}, this.readTimeout);

		return this.socket.write(sendData).then(() =>
			this.socket.read().then(data => {
				clearTimeout(this.readTimer);

				if (data === undefined || data.length === 0) {
					return Promise.reject(new SteerError("Steer Error: Receive failed (receiver down?)", 4));
				}

				const responseData = data.slice(prefixLength);
				const unserializedData = OpMsg.decode(responseData);

				if (this.params.logger?.debug) {
					this.params.logger.debug(`Steer Recv: ${JSON.stringify(unserializedData)}`);
				}

				return Promise.resolve(unserializedData);
			})
		).catch(err =>
			Promise.reject(new SteerError(`Steer Error: Send failed: ${err}`, 4))
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

module.exports = SteerConnection;