/* eslint-disable no-empty-function */
"use strict";

const net = require("net");
const PromiseSocket = require("promise-socket").PromiseSocket;
const struct = require("python-struct");
const EventEmitter = require("events").EventEmitter;
const hub = require("./protobuf/hub").proto_hub;
const HubError = require("./hubError");
const { makeGuid } = require("./teraPlatformGuid");

class HubConnection extends EventEmitter {
	constructor(hubAddr, hubPort, params) {
		super();

		this.MAX_LENGTH = 0xFFFF;

		this.opMsgResultCode = {
			success: 0
		};

		this.serverEvent = {
			CONNECTED: 1,
			DISCONNECTED: 2
		};

		this.hubFunctionMap = {
			// 1: RegisterReq
			2: this.RegisterAns.bind(this),
			// 3: SendMessageReq
			4: this.SendMessageAns.bind(this),
			5: this.RecvMessageReq.bind(this),
			6: this.PingReq.bind(this),
			// 7: PingAns
			8: this.ServerEvent.bind(this)
		};

		this.idFormat = "H";
		this.idSize = struct.sizeOf(this.idFormat);
		this.headerFormat = "H";
		this.headerSize = struct.sizeOf(this.headerFormat);

		this.watchServerCategories = {};

		this.socket = null;
		this.recvTimeout = 5000;
		this.connected = false;
		this.registred = false;
		this.biasCount = 0;
		this.jobId = 0;
		this.uniqueServerId = 0;
		this.reconnectInterval = null;
		this.hubAddr = hubAddr;
		this.hubPort = hubPort;
		this.params = params;
		this.recvTimers = new Map();
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
		});

		this.socket.socket.on("data", data =>
			this.recv(data)
		);

		return this.socket.connect(this.hubPort, this.hubAddr).then(() => {
			this.connected = true;
			return this.register();
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

	//
	// Hub functions
	//

	register() {
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

		const reqData = {
			serverId: makeGuid(this.serviceId, this.uniqueServerId),
			eventSub: Object.keys(this.watchServerCategories)
		};

		const req = hub.RegisterReq.encode(reqData);
		const msg = Buffer.concat([struct.pack(this.idFormat, 1), req.finish()]); // 1: RegisterReq

		if (this.params.logger?.debug) {
			this.params.logger.debug(`Send RegisterReq: ${JSON.stringify(this.formatJson(reqData))}`);
		}

		return this.send(msg).then(() => new Promise((resolve, reject) => {
			this.once("register", data => {
				clearTimeout(this.recvTimers.get("register"));
				this.recvTimers.delete("register");

				if (this.params.logger?.info) {
					this.params.logger.info(`Registred: category ${this.serviceId}, number ${this.uniqueServerId}`);
				}

				data.serverList.forEach(gusid => {
					const category = (gusid & 0xFF000000) >> 24;

					if (this.watchServerCategories[category] === undefined) {
						this.watchServerCategories[category] = new Set();
					}

					this.watchServerCategories[category].add(gusid);
				});

				this.registred = true;

				resolve();
			});

			this.recvTimers.set("register", setTimeout(() =>
				reject(new HubError("Send RegisterReq: Recv timed out", 0x000FE100)), this.recvTimeout));
		}));
	}

	sendMessage(serverId, msgId, reqFunc, resFunc, msgData, protoName, funcName = null) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new HubError("Not registred", 0x000FE003));
		}

		let label = `${protoName}.${reqFunc.name}`;

		if (funcName) {
			label += `.${funcName}`;
		}

		const jobId = ++this.jobId;

		if (this.params.logger?.debug) {
			this.params.logger.debug(`Send ${label} (${jobId}): ${JSON.stringify(this.formatJson(msgData))}`);
		}

		const msgBuf = Buffer.concat([
			struct.pack(this.idFormat, msgId),
			reqFunc.encode(msgData).finish()
		]);

		const req = hub.SendMessageReq.encode({ jobId, serverId, msgBuf });
		const msg = Buffer.concat([struct.pack(this.idFormat, 3), req.finish()]); // 3: SendMessageReq

		return this.send(msg).then(() => new Promise((resolve, reject) => {
			this.once(jobId, data => {
				clearTimeout(this.recvTimers.get(jobId));
				this.recvTimers.delete(jobId);

				label = `${protoName}.${resFunc.name}`;

				if (funcName) {
					label += `.${funcName}`;
				}

				if (data === null) {
					return reject(new HubError(`${label}: Failed`, 0x000FE001));
				}

				const res = resFunc.decode(data.msgBuf);

				if (this.params.logger?.debug) {
					this.params.logger.debug(`Recv ${label} (${jobId}): ${JSON.stringify(this.formatJson(res))}`);
				}

				if (res.result !== undefined) {
					if (res.result !== resFunc.result_type.FAILED) {
						return resolve(res);
					}

					return reject(
						new HubError(`${label}: ${resFunc.result_type[res.result]}`, res.result)
					);
				}

				return resolve(res); // opMsg Ans
			});

			this.recvTimers.set(jobId, setTimeout(() =>
				reject(new HubError(`Send ${label} (${jobId}): Recv timed out`, 0x000FE100)), this.recvTimeout));
		}));
	}

	//
	// Handlers
	//

	RegisterAns(data) { // 2
		const res = hub.RegisterAns.decode(data);

		if (this.params.logger?.debug) {
			this.params.logger.debug(`Recv RegisterAns: ${JSON.stringify(this.formatJson(res))}`);
		}

		if (res.result) {
			this.emit("register", res);
		} else {
			this.biasCount++;

			if (this.biasCount > 10000) {
				return Promise.reject(new HubError("Can't register server", 0x000FE002));
			}

			this.connect();
		}
	}

	SendMessageAns(data) { // 4
		const res = hub.SendMessageAns.decode(data);

		// Process failed Ans
		if (!res.result) {
			if (this.listenerCount(res.jobId) !== 0) {
				this.emit(res.jobId, null);
			} else {
				this.emit("message", null);
			}
		}

		return res;
	}

	RecvMessageReq(data) { // 5
		const recv = hub.RecvMessageReq.decode(data);

		const serverId = recv.serverId;
		const jobId = recv.jobId;
		const msgId = struct.unpack(this.idFormat, Uint8Array.prototype.slice.call(recv.msgBuf, 0, this.idSize));
		const msgBuf = Uint8Array.prototype.slice.call(recv.msgBuf, this.idSize);

		if (this.listenerCount(jobId) !== 0) {
			this.emit(jobId, { serverId, jobId, msgId, msgBuf });
		} else {
			if (this.params.logger?.debug) {
				this.params.logger.debug(`Recv RecvMessageReq: ${JSON.stringify(this.formatJson(recv))}`);
			}

			this.emit("message", { serverId, jobId, msgId, msgBuf });
		}
	}

	PingReq(data) { // 6
		hub.PingReq.decode(data);

		if (this.params.logger?.debug) {
			this.params.logger.debug("Recv PingReq");
		}

		const req = hub.PingAns.encode();
		const msg = Buffer.concat([struct.pack(this.idFormat, 7), req.finish()]); // 7: PingAns

		if (this.params.logger?.debug) {
			this.params.logger.debug("Send PingAns");
		}

		return this.send(msg);
	}

	ServerEvent(data) { // 8
		const res = hub.ServerEvent.decode(data);

		if (this.params.logger?.debug) {
			this.params.logger.debug(`Recv ServerEvent: ${JSON.stringify(this.formatJson(res))}`);
		}

		const category = (res.serverId & 0xFF000000) >> 24;

		if (res.event == this.serverEvent.CONNECTED) {
			if (this.watchServerCategories[category] === undefined) {
				this.watchServerCategories[category] = new Set();
			}

			this.watchServerCategories[category].add(res.serverId);
		} else {
			this.watchServerCategories[category].remove(res.server_id);
		}
	}

	//
	// Util
	//

	send(msg) {
		const dataLength = msg.length;
		const size = this.headerSize + dataLength;

		if (dataLength > this.MAX_LENGTH - this.headerSize) {
			return Promise.reject(new HubError(`Try to send ${dataLength} bytes whereas maximum is ${this.MAX_LENGTH - this.headerSize}`, 0x000FE006));
		}

		const data = Buffer.concat([struct.pack(this.headerFormat, size), msg]);

		return this.socket.write(data).then(() =>
			Promise.resolve()
		).catch(err =>
			Promise.reject(new HubError(`Send failed: ${err}`, 0x000FE005))
		);
	}

	recv(data) {
		let buffer = data;
		let dataSize = buffer.length;

		while (dataSize >= this.headerSize) {
			const size = struct.unpack(this.headerFormat, Uint8Array.prototype.slice.call(buffer, 0, this.headerSize))[0];

			if (size > this.MAX_LENGTH) {
				if (this.params.logger?.error) {
					this.params.logger?.error(new HubError(`Try to receive ${size} bytes whereas maximum is ${this.MAX_LENGTH}`, 0x000FE006));
				}

				break;
			}

			if (dataSize < size) {
				break;
			}

			const body = Uint8Array.prototype.slice.call(buffer, this.headerSize, size);
			const msgId = struct.unpack(this.idFormat, body)[0];

			buffer = Uint8Array.prototype.slice.call(buffer, size);
			dataSize = buffer.length;

			if (typeof this.hubFunctionMap[msgId] !== "function") {
				if (this.params.logger?.error) {
					this.params.logger.error(new HubError(`Do not exist function received: ${msgId}`, 0x000FE007));
				}

				continue;
			}

			this.hubFunctionMap[msgId](Uint8Array.prototype.slice.call(body, this.idSize));
		}
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

module.exports = HubConnection;