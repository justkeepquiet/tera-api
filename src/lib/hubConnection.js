/* eslint-disable no-empty-function */
"use strict";

const net = require("net");
const PromiseSocket = require("promise-socket").PromiseSocket;
const struct = require("python-struct");
const EventEmitter = require("events").EventEmitter;
const hub = require("./protobuf/hub").proto_hub;
const HubError = require("./hubError");

class HubConnection extends EventEmitter {
	constructor(hubAddr, hubPort, params) {
		super();

		this.MAX_LENGTH = 0xFFFF;

		this.gusid = {
			boxapi: (16 << 24) + 1, // 268435457
			steersession: (10 << 24) + 0, // 167772160
			steermind: (4 << 24) + 0 // 67108864
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
		this.connected = false;
		this.registred = false;
		this.biasCount = 0;
		this.jobId = 0;
		this.uniqueServerId = 0;
		this.reconnectInterval = null;
		this.hubAddr = hubAddr;
		this.hubPort = hubPort;
		this.params = params;
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
			if (this.params.logger?.error) {
				this.params.logger.error(err.toString());
			}

			if (err.code === "ECONNRESET" || err.code === "EISCONN") {
				this.connected = false;
				this.registred = false;

				this.reconnect();
			}

			clearTimeout(this.readTimer);
		});

		this.socket.socket.on("data", data =>
			this.recv(data)
		);

		return this.socket.connect(this.hubPort, this.hubAddr).then(() => {
			this.connected = true;
			return this.register();
		}).catch(() => {});
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

		const req = hub.RegisterReq.encode({
			serverId: this.makeGuid(this.serviceId, this.uniqueServerId),
			eventSub: Object.keys(this.watchServerCategories)
		});

		const msg = Buffer.concat([struct.pack(this.idFormat, 1), req.finish()]); // 1: RegisterReq

		return this.send("RegisterReq", msg).then(() =>
			new Promise(resolve => {
				this.once("register", () => resolve());
			})
		);
	}

	sendMessage(serverId, msgId, msgData) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new HubError("Not registred", 3));
		}

		const jobId = ++this.jobId;
		const msgBuf = Buffer.concat([struct.pack(this.idFormat, msgId), msgData]);

		const req = hub.SendMessageReq.encode({
			jobId,
			serverId,
			msgBuf
		});

		const msg = Buffer.concat([struct.pack(this.idFormat, 3), req.finish()]); // 3: SendMessageReq

		return this.send("SendMessageReq", msg).then(() =>
			new Promise(resolve => {
				this.once(jobId, res => resolve(res));
			})
		);
	}

	//
	// Handlers
	//

	RegisterAns(data) { // 2
		const res = hub.RegisterAns.decode(data);

		if (res.result) {
			if (this.params.logger?.info) {
				this.params.logger.info(`Registred: category ${this.serviceId}, number ${this.uniqueServerId}`);
			}

			res.serverList.forEach(gusid => {
				const category = (gusid & 0xFF000000) >> 24;

				if (this.watchServerCategories[category] === undefined) {
					this.watchServerCategories[category] = new Set();
				}

				this.watchServerCategories[category].add(gusid);
			});

			this.registred = true;

			this.emit("register");
		} else {
			this.biasCount++;

			if (this.biasCount > 10000) {
				return Promise.reject(new HubError("Can't register server", 2));
			}

			this.connect();
		}
	}

	SendMessageAns(data) { // 4
		const res = hub.SendMessageAns.decode(data);

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

		const serverID = recv.serverId;
		const jobId = recv.jobId;
		const msgId = struct.unpack(this.idFormat, Uint8Array.prototype.slice.call(recv.msgBuf, 0, this.idSize));
		const msgBuf = Uint8Array.prototype.slice.call(recv.msgBuf, this.idSize);

		if (this.listenerCount(jobId) !== 0) {
			this.emit(jobId, { serverID, jobId, msgId, msgBuf });
		} else {
			this.emit("message", { serverID, jobId, msgId, msgBuf });
		}
	}

	PingReq(data) { // 6
		hub.PingReq.decode(data);

		const req = hub.PingAns.encode();
		const msg = Buffer.concat([struct.pack(this.idFormat, 7), req.finish()]); // 7: PingAns

		return this.send("PingAns", msg);
	}

	ServerEvent(data) { // 8
		const res = hub.ServerEvent.decode(data);
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

	send(handlerName, msg) {
		const dataLength = msg.length;
		const size = this.headerSize + dataLength;

		if (dataLength > this.MAX_LENGTH - this.headerSize) {
			return Promise.reject(new HubError(`Try to send ${dataLength} bytes whereas maximum is ${this.MAX_LENGTH - this.headerSize}`));
		}

		const sendData = Buffer.concat([struct.pack(this.headerFormat, size), msg]);

		if (this.params.logger?.debug) {
			this.params.logger.debug(`Send ${handlerName}: ${sendData.toString("hex")}`);
		}

		return this.socket.write(sendData).then(() =>
			Promise.resolve()
		).catch(err =>
			Promise.reject(new HubError(`Send failed: ${err}`, 4))
		);
	}

	recv(data) {
		let buffer = data;
		let dataSize = buffer.length;

		while (dataSize >= this.headerSize) {
			const size = struct.unpack(this.headerFormat, buffer)[0];

			if (dataSize < size) break;

			const dataBody = Uint8Array.prototype.slice.call(buffer, this.headerSize, size);
			const msgId = struct.unpack(this.idFormat, dataBody)[0];

			buffer = Uint8Array.prototype.slice.call(buffer, size);
			dataSize = buffer.length;

			if (typeof this.hubFunctionMap[msgId] !== "function") {
				if (this.params.logger?.error) {
					this.params.logger.error(`Do not exist function received: ${msgId}`);
				}

				continue;
			}

			if (this.params.logger?.debug) {
				this.params.logger.debug(`Recv ${this.hubFunctionMap[msgId].name.slice(6)}: ${buffer.toString("hex")}`);
			}

			this.hubFunctionMap[msgId](Uint8Array.prototype.slice.call(dataBody, this.idSize));
		}
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

module.exports = HubConnection;