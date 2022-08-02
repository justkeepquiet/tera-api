/* eslint-disable no-empty-function */
"use strict";

const net = require("net");
const uuid = require("uuid").v4;
const PromiseSocket = require("promise-socket").PromiseSocket;
const struct = require("python-struct");
const OpMsg = require("./protobuf/opMsg").op.OpMsg;
const SteerError = require("./steerError");
const { serverCategory, readGuid, makeGuid } = require("./teraPlatformGuid");

class SteerConnection {
	constructor(steerAddr, steerPort, params) {
		this.steerResultCode = {
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

		this.socket = null;
		this.readTimeout = 5000;
		this.connected = false;
		this.registred = false;
		this.biasCount = 0;
		this.jobId = 0;
		this.uniqueServerId = 0;
		this.reconnectInterval = null;
		this.steerAddr = steerAddr;
		this.steerPort = steerPort;
		this.params = params;
		this.readTimer = null;
	}

	get isConnected() {
		return this.connected;
	}

	get isRegistred() {
		return this.registred;
	}

	connect() {
		this.destroy();

		this.socket = new PromiseSocket(new net.Socket());
		this.reconnectInterval = setInterval(() => this.reconnect(), 10000);

		this.socket.socket.on("error", err => {
			if (err.code === "ECONNRESET" || err.code === "EISCONN") {
				this.connected = false;
				this.registred = false;

				this.reconnect();
			}

			clearTimeout(this.readTimer);
		});

		return this.socket.connect(this.steerPort, this.steerAddr).then(() => {
			this.connected = true;
			return this.checkRegistered();
		}).catch(err => {
			if (this.params.logger?.error) {
				this.params.logger.error(err.toString());
			}
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

		clearInterval(this.reconnectInterval);

		if (this.socket) {
			this.socket.destroy();
		}
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
			gufid: makeGuid(serverCategory.steerhub, 20), // checkRegister
			senderGusid: makeGuid(this.serviceId, this.uniqueServerId),
			receiverGusid: makeGuid(serverCategory.steerhub, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,
			jobId: ++this.jobId
		});

		return this.sendAndRecv(opMsg).then(data => {
			if (data.resultCode && readGuid(data.resultCode).number === this.steerResultCode.success) {
				if (this.params.logger?.info) {
					this.params.logger.info(`Registred: category ${this.serviceId}, number ${this.uniqueServerId}`);
				}

				this.registred = true;
			} else {
				this.biasCount++;

				if (this.biasCount > 10000) {
					return Promise.reject(new SteerError("Can't register server", 0x000FF002));
				}

				this.connect();
			}
		}).catch(err => {
			if (this.params.logger?.error) {
				this.params.logger.error(err.toString());
			}
		});
	}

	sendMessage(opMsg) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new SteerError("Not registred", 0x000FF003));
		}

		return this.sendAndRecv(opMsg);
	}

	sendAndRecv(opMsg) {
		const id = uuid();

		if (this.params.logger?.debug) {
			this.params.logger.debug(`Send (${id}): ${JSON.stringify(this.formatJson(opMsg))}`);
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
					return Promise.reject(new SteerError("Receive failed (receiver down?)", 0x000FF004));
				}

				const responseData = data.slice(prefixLength);
				const unserializedData = OpMsg.decode(responseData);

				if (this.params.logger?.debug) {
					this.params.logger.debug(`Recv (${id}): ${JSON.stringify(this.formatJson(unserializedData))}`);
				}

				return Promise.resolve(unserializedData);
			})
		).catch(err =>
			Promise.reject(new SteerError(`Send failed: ${err}`, 0x000FF005))
		);
	}

	formatJson(inObj) {
		const obj = { ...inObj };

		for (const [key, value] of Object.entries(obj)) {
			if (Buffer.isBuffer(value)) {
				obj[key] = Buffer.from(value).toString();
			} else if (typeof value === "object") {
				obj[key] = this.formatJson(value);
			} else {
				obj[key] = value;
			}
		}

		return obj;
	}
}

module.exports = SteerConnection;