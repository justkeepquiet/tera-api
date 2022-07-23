"use strict";

const OpMsg = require("./protobuf/opMsg").op.OpMsg;
const SteerError = require("./steerError");
const SteerConnection = require("./steerConnection");

class SteerFunctions extends SteerConnection {
	constructor(steerAddr, steerPort, serviceId, serviceName, params = { logger: null }) {
		super(steerAddr, steerPort, params);

		this.serviceId = serviceId;
		this.serviceName = serviceName;
	}

	//
	// SteerSession functions
	//

	openSession(loginId, password, clientIp) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new SteerError("Not registred", 3));
		}

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.steersession, 1), // openSession
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
			receiverGusid: this.makeGuid(this.serverType.steersession, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("loginid"),
					value: Buffer.from(loginId)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("password"),
					value: Buffer.from(password)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("clientIP"),
					value: Buffer.from(clientIp)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("additionalInfo"),
					value: Buffer.from("")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("serviceName"),
					value: Buffer.from(this.serviceName)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("allowMultipleLoginFlag"),
					value: Buffer.from("1")
				})
			]
		});

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.steerResultCode.success) {
				return Promise.resolve({
					sessionKey: Buffer.from(data.sessionKey).toString(),
					userSn: Buffer.from(data.resultScalar).toString()
				});
			} else {
				return Promise.reject(new SteerError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	checkSession(sessionKey, clientIp) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new SteerError("Not registred", 3));
		}

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.steersession, 2), // checkSession
			sessionKey: Buffer.from(sessionKey),
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
			receiverGusid: this.makeGuid(this.serverType.steersession, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("clientIP"),
					value: Buffer.from(clientIp)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("additionalInfo"),
					value: Buffer.from("")
				})
			]
		});

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.steerResultCode.success) {
				const resultedSessionLey = Buffer.from(data.sessionKey).toString();

				if (resultedSessionLey === sessionKey) {
					return Promise.resolve(resultedSessionLey);
				} else {
					return Promise.reject(resultCode);
				}
			} else {
				return Promise.reject(new SteerError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	closeSession(sessionKey) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new SteerError("Not registred", 3));
		}

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.steersession, 3), // closeSession
			sessionKey: Buffer.from(sessionKey),
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
			receiverGusid: this.makeGuid(this.serverType.steersession, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST
		});

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.steerResultCode.success) {
				return Promise.resolve(data);
			} else {
				return Promise.reject(new SteerError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	//
	// SteerMind functions
	//

	getFunctionList(sessionKey, jobId = 2) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new SteerError("Not registred", 3));
		}

		let nextJobId = jobId;

		return this.getFunctionListBySessionAndServerType(sessionKey, nextJobId, 0, 0).then(({ totalCount }) => {
			const promises = [];

			for (let num = 0; num <= totalCount; num += 512) {
				promises.push(this.getFunctionListBySessionAndServerType(sessionKey, ++nextJobId, num, 512));
			}

			return Promise.all(promises).then(data => {
				const functions = {};

				data[0].rows.forEach(row => {
					if (row.values.length >= 6) {
						functions[row.values[4].toString()] = row.values[5].toString();
					}
				});

				return Promise.resolve(functions);
			});
		});
	}

	getFunctionListBySessionAndServerType(sessionKey, nextJobId, startPos, rowLength) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new SteerError("Not registred", 3));
		}

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.steermind, 16), // getFunctionListBySessionAndServerType
			sessionKey: Buffer.from(sessionKey),
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
			receiverGusid: this.makeGuid(this.serverType.steermind, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,
			jobId: nextJobId,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("serverType"),
					value: Buffer.from(this.serviceId.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("startPos"),
					value: Buffer.from(startPos.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("rowlength"),
					value: Buffer.from(rowLength.toString())
				})
			]
		});

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.steerResultCode.success) {
				return Promise.resolve(data.resultSets[0]);
			} else {
				return Promise.reject(new SteerError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	checkFunctionExecutionPrivilege(sessionKey, globalUniqueFunctionIDint, executeArguments = null) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new SteerError("Not registred", 3));
		}

		let strExecuteArguments = "";

		if (executeArguments !== null) {
			if (executeArguments.length === 1) {
				strExecuteArguments = executeArguments[0];
			} else {
				strExecuteArguments = executeArguments.join(",");
			}
		}

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.steermind, 18), // checkFunctionExecutionPrivilege
			sessionKey: Buffer.from(sessionKey),
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
			receiverGusid: this.makeGuid(this.serverType.steermind, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("globalUniqueFunctionIDint"),
					value: Buffer.from(globalUniqueFunctionIDint.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("executeArguments"),
					value: Buffer.from(strExecuteArguments)
				})
			]
		});

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.steerResultCode.success) {
				return Promise.resolve(data.resultScalar);
			} else {
				return Promise.reject(new SteerError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	notifyFunctionResult(sessionKey, strTransId, result, executeComment = null) {
		if (!this.connected || !this.registred) {
			return Promise.reject(new SteerError("Not registred", 3));
		}

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.steermind, 19), // notifyFunctionResult
			sessionKey: Buffer.from(sessionKey),
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
			receiverGusid: this.makeGuid(this.serverType.steermind, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("transactionIDint"),
					value: Buffer.from(strTransId.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("executionResult"),
					value: Buffer.from(result)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("result"),
					value: Buffer.from(result)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("executeComment"),
					value: Buffer.from(executeComment)
				})
			]
		});

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.steerResultCode.success) {
				return Promise.resolve(resultCode);
			} else {
				return Promise.reject(new SteerError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}
}

module.exports = SteerFunctions;