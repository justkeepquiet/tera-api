"use strict";

const opArb = require("./protobuf/opArb").proto_oparb;
const opUent = require("./protobuf/opUent").proto_opuent;
const HubError = require("./hubError");
const HubConnection = require("./hubConnection");
const { gusid, serverCategory, readGuid, makeGuid } = require("./teraPlatformGuid");

class HubFunctions extends HubConnection {
	constructor(hubAddr, hubPort, serviceId, params = { logger: null }) {
		super(hubAddr, hubPort, params);

		this.serviceId = serviceId;

		this.on("message", data => {
			if (data !== null) {
				// handle incoming messages
			}
		});
	}

	//
	// OpArb functions
	//

	opMsg(opMsg, serverId) {
		const msgData = opArb.opmsg.encode(opMsg).finish();

		return this.sendMessage(serverId, 1, msgData).then(data => { // 1: opmsg
			if (data === null) {
				return Promise.reject(new HubError("OpArb.opmsg: Failed", 1));
			}

			return Promise.resolve(
				opArb.opmsg.decode(data.msgBuf)
			);
		});
	}

	kickUser(serverId, userSrl, kickCode) {
		const msgData = opArb.KickUserReq.encode({ userSrl, kickCode }).finish();

		return this.sendMessage(serverId, 2, msgData).then(data => { // 2: KickUserReq
			if (data === null) {
				return Promise.reject(new HubError("OpArb.KickUserReq: Failed", 1));
			}

			const ans = opArb.KickUserAns.decode(data.msgBuf);

			if (ans.result !== opArb.KickUserAns.result_type.FAILED) {
				return Promise.resolve(ans);
			} else {
				return Promise.reject(
					new HubError(`OpArb.KickUserAns: ${opArb.KickUserAns.result_type[ans.result]}`, ans.result)
				);
			}
		});
	}

	sendMsg(serverId, userSrl, message) {
		const msgData = opArb.SendMessageReq.encode({ userSrl, message: Buffer.from(message.toString(), "utf16le") }).finish();

		return this.sendMessage(serverId, 4, msgData).then(data => { // 4: SendMessageReq
			if (data === null) {
				return Promise.reject(new HubError("OpArb.SendMessageReq: Failed", 1));
			}

			const ans = opArb.SendMessageAns.decode(data.msgBuf);

			if (ans.result === opArb.SendMessageAns.result_type.SUCCESS) {
				return Promise.resolve(ans);
			} else {
				return Promise.reject(
					new HubError(`OpArb.SendMessageAns: ${opArb.SendMessageAns.result_type[ans.result]}`, ans.result)
				);
			}
		});
	}

	bulkKick(serverId, kickCode, filter = 0, filterMask = 0) {
		const msgData = opArb.BulkKickReq.encode({ kickCode, filter, filterMask }).finish();

		return this.sendMessage(serverId, 6, msgData).then(data => { // 6: BulkKickReq
			if (data === null) {
				return Promise.reject(new HubError("OpArb.BulkKickReq: Failed", 1));
			}

			return Promise.resolve(
				opArb.BulkKickAns.decode(data.msgBuf)
			);
		});
	}

	boxNotiUser(serverId, userSrl, charSrl = 0) {
		const msgData = opArb.BoxNotiUserReq.encode({ serverId, userSrl, charSrl }).finish();

		return this.sendMessage(serverId, 15, msgData).then(data => { // 15: BoxNotiUserReq
			if (data === null) {
				return Promise.reject(new HubError("OpArb.BoxNotiUserReq: Failed", 1));
			}

			const ans = opArb.BoxNotiUserAns.decode(data.msgBuf);

			if (ans.result !== opArb.BoxNotiUserAns.result_type.FAILED) {
				return Promise.resolve(ans);
			} else {
				return Promise.reject(
					new HubError(`OpArb.BoxNotiUserAns: ${opArb.BoxNotiUserAns.result_type[ans.result]}`, ans.result)
				);
			}
		});
	}

	addBenefit(serverId, userSrl, benefitId, remainSec) {
		const msgData = opArb.AddBenefitReq.encode({ userSrl, benefitId, remainSec }).finish();

		return this.sendMessage(serverId, 38, msgData).then(data => { // 38: AddBenefitReq
			if (data === null) {
				return Promise.reject(new HubError("OpArb.AddBenefitReq: Failed", 1));
			}

			const ans = opArb.AddBenefitAns.decode(data.msgBuf);

			if (ans.result !== opArb.AddBenefitAns.result_type.FAILED) {
				return Promise.resolve(ans);
			} else {
				return Promise.reject(
					new HubError(`OpArb.AddBenefitAns: ${opArb.AddBenefitAns.result_type[ans.result]}`, ans.result)
				);
			}
		});
	}

	removeBenefit(serverId, userSrl, benefitId) {
		const msgData = opArb.RemoveBenefitReq.encode({ userSrl, benefitId }).finish();

		return this.sendMessage(serverId, 40, msgData).then(data => { // 40: RemoveBenefitReq
			if (data === null) {
				return Promise.reject(new HubError("OpArb.RemoveBenefitReq: Failed", 1));
			}

			const ans = opArb.RemoveBenefitAns.decode(data.msgBuf);

			if (ans.result !== opArb.RemoveBenefitAns.result_type.FAILED) {
				return Promise.resolve(ans);
			} else {
				return Promise.reject(
					new HubError(`OpArb.RemoveBenefitAns: ${opArb.RemoveBenefitAns.result_type[ans.result]}`, ans.result)
				);
			}
		});
	}

	//
	// OpUent functions
	//

	queryUser(userSrl, action = 0, serverId = 0) {
		const msgData = opUent.QueryUserReq.encode({ userSrl, action, serverId }).finish();

		return this.sendMessage(gusid.userenter, 1, msgData).then(data => { // 1: QueryUserReq
			console.log(data);
			if (data === null) {
				return Promise.reject(new HubError("OpUent.QueryUserReq: Failed", 1));
			}

			return Promise.resolve(
				opUent.QueryUserAns.decode(data.msgBuf)
			);
		});
	}

	getServerStat() {
		const msgData = opUent.GetServerStatReq.encode().finish();

		return this.sendMessage(gusid.userenter, 3, msgData).then(data => { // 3: GetServerStatReq
			if (data === null) {
				return Promise.reject(new HubError("OpUent.GetServerStatReq: Failed", 1));
			}

			return Promise.resolve(
				opUent.GetServerStatAns.decode(data.msgBuf)
			);
		});
	}

	getAllServerStat(serverCat) {
		const msgData = opUent.GetAllServerStatReq.encode({ serverCat }).finish();

		return this.sendMessage(gusid.userenter, 5, msgData).then(data => { // 5: GetAllServerStatReq
			if (data === null) {
				return Promise.reject(new HubError("OpUent.GetAllServerStatReq: Failed", 1));
			}

			return Promise.resolve(
				opUent.GetAllServerStatAns.decode(data.msgBuf)
			);
		});
	}

	//
	// OpMsg functions
	//

	createBox(receiverServiceSN, receiverUserSN, startDate, endDate, visibleFlag, itemData, tagData,
		receiverGUSID = null, receiverCharacterSN = null, receiverCharacterName = null, usableTimeAfterOpen = null, externalTransactionKey = null
	) {
		const { boxTagInfo, boxServiceItemInfo } = this.convertBoxTagValue(tagData, itemData);

		const opMsg = opArb.opmsg.create({
			gufid: makeGuid(serverCategory.boxapi, 107), // CreateBox
			senderGusid: makeGuid(this.serviceId, 0),
			receiverGusid: makeGuid(serverCategory.boxapi, 0),
			execType: opArb.opmsg.ExecType.EXECUTE,
			jobType: opArb.opmsg.JobType.REQUEST,

			arguments: [
				opArb.opmsg.Argument.create({
					name: Buffer.from("receiverServiceSN"),
					value: Buffer.from(receiverServiceSN.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("receiverUserSN"),
					value: Buffer.from(receiverUserSN.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("receiverGUSID"),
					value: Buffer.from(receiverGUSID ? receiverGUSID.toString() : "")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("receiverCharacterSN"),
					value: Buffer.from(receiverCharacterSN ? receiverCharacterSN.toString() : "")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("receiverCharacterName"),
					value: Buffer.from(receiverCharacterName ? receiverCharacterName.toString() : "")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("senderUserSN"),
					value: Buffer.from("")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("senderGUSID"),
					value: Buffer.from("")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("senderCharacterSN"),
					value: Buffer.from("")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("senderCharacterName"),
					value: Buffer.from("")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("createEndPointCode"),
					value: Buffer.from(this.serviceId.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("externalTransactionKey"),
					value: Buffer.from(externalTransactionKey ? externalTransactionKey.toString() : "")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("startActivationDateTime"),
					value: Buffer.from(startDate.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("endActivationDateTime"),
					value: Buffer.from(endDate.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("activateDurationAfterOpen"),
					value: Buffer.from(usableTimeAfterOpen ? usableTimeAfterOpen.toString() : "")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("visableFlagBeforeActivation"),
					value: Buffer.from(Number(visibleFlag).toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("boxEventSN"),
					value: Buffer.from("")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("boxTagInfo"),
					value: Buffer.from(boxTagInfo)
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("boxServiceItemInfo"),
					value: Buffer.from(boxServiceItemInfo)
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("boxTransactionSN"),
					value: Buffer.from("")
				})
			]
		});

		return this.opMsg(opMsg, gusid.boxapi).then(data => {
			const resultCode = readGuid(data.resultCode);

			if (resultCode.number === this.opMsgResultCode.success) {
				return Promise.resolve(Buffer.from(data.resultScalar).toString());
			} else {
				return Promise.reject(
					new HubError(`OpMsg.CreateBox: ${resultCode.category}:${resultCode.number}`, data.resultCode)
				);
			}
		});
	}

	getServiceItem(serviceItemSN) {
		const opMsg = opArb.opmsg.create({
			gufid: makeGuid(serverCategory.boxapi, 116), // GetServiceItem
			senderGusid: makeGuid(this.serviceId, 0),
			receiverGusid: makeGuid(serverCategory.boxapi, 0),
			execType: opArb.opmsg.ExecType.EXECUTE,
			jobType: opArb.opmsg.JobType.REQUEST,

			arguments: [
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemSN"),
					value: Buffer.from(serviceItemSN.toString())
				})
			]
		});

		return this.opMsg(opMsg, gusid.boxapi).then(data => {
			const resultCode = readGuid(data.resultCode);

			if (resultCode.number === this.opMsgResultCode.success) {
				const resultSets = [];

				data.resultSets[0].rows.forEach(row => {
					const resultSet = {};

					row.values.forEach((value, column) =>
						resultSet[data.resultSets[0].columnNames[column].toString()] = value.toString()
					);

					resultSets.push(resultSet);
				});

				return Promise.resolve(resultSets);
			} else {
				return Promise.reject(
					new HubError(`OpMsg.GetServiceItem: ${resultCode.category}:${resultCode.number}`, data.resultCode)
				);
			}
		});
	}

	createServiceItem(userSN, itemMappingSN, serviceSN, startActivationTime, enableFlag = true,
		itemName = "", itemDescription = "", tagData = null
	) {
		const opMsg = opArb.opmsg.create({
			gufid: makeGuid(serverCategory.boxapi, 117), // CreateServiceItem
			senderGusid: makeGuid(this.serviceId, 0),
			receiverGusid: makeGuid(serverCategory.boxapi, 0),
			execType: opArb.opmsg.ExecType.EXECUTE,
			jobType: opArb.opmsg.JobType.REQUEST,

			arguments: [
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemServiceSN"),
					value: Buffer.from(serviceSN.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemMappingItemSN"),
					value: Buffer.from(itemMappingSN.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemStartActivationDateTime"),
					value: Buffer.from(startActivationTime.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemEnableFlag"),
					value: Buffer.from(enableFlag ? "1" : "0")
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemName"),
					value: Buffer.from(itemName.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemDescription"),
					value: Buffer.from(itemDescription.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemRegisterUserSN"),
					value: Buffer.from(userSN.toString())
				}),
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemTagInfo"),
					value: Buffer.from(tagData ? tagData : "0")
				})
			]
		});

		return this.opMsg(opMsg, gusid.boxapi).then(data => {
			const resultCode = readGuid(data.resultCode);

			if (resultCode.number === this.opMsgResultCode.success) {
				return Promise.resolve(Buffer.from(data.resultScalar).toString());
			} else {
				return Promise.reject(
					new HubError(`OpMsg.CreateServiceItem: ${resultCode.category}:${resultCode.number}`, data.resultCode)
				);
			}
		});
	}

	removeServiceItem(serviceItemSN) {
		const opMsg = opArb.opmsg.create({
			gufid: makeGuid(serverCategory.boxapi, 118), // SetDisableServiceItem
			senderGusid: makeGuid(this.serviceId, 0),
			receiverGusid: makeGuid(serverCategory.boxapi, 0),
			execType: opArb.opmsg.ExecType.EXECUTE,
			jobType: opArb.opmsg.JobType.REQUEST,

			arguments: [
				opArb.opmsg.Argument.create({
					name: Buffer.from("serviceItemSN"),
					value: Buffer.from(serviceItemSN.toString())
				})
			]
		});

		return this.opMsg(opMsg, gusid.boxapi).then(data => {
			const resultCode = readGuid(data.resultCode);

			if (resultCode.number === this.opMsgResultCode.success) {
				return Promise.resolve();
			} else {
				return Promise.reject(
					new HubError(`OpMsg.SetDisableServiceItem: ${resultCode.category}:${resultCode.number}`, data.resultCode)
				);
			}
		});
	}

	//
	// Utils
	//

	convertBoxTagValue(boxTagInfoList, boxServiceItemInfoList) {
		let boxTagInfo = "";
		let boxServiceItemInfo = "";

		if (boxTagInfoList.length > 0) {
			boxTagInfo += boxTagInfoList.length.toString();

			boxTagInfoList.forEach(boxTag => {
				boxTagInfo += `,${boxTag.boxTagSN},${Buffer.from(
					boxTag.boxTagValue.toString(), "utf8").toString("hex")}`;
			});
		}

		if (boxServiceItemInfoList.length > 0) {
			boxServiceItemInfo += boxServiceItemInfoList.length.toString();

			boxServiceItemInfoList.forEach(boxItemTag => {
				boxServiceItemInfo += `,${boxItemTag.serviceItemSN},${boxItemTag.externalItemKey}`;
				boxServiceItemInfo += `,${boxItemTag.serviceItemTag.length}`;

				boxItemTag.serviceItemTag.forEach(serviceItemTag => {
					boxServiceItemInfo += `,${serviceItemTag.serviceItemTagSN},${
						Buffer.from(serviceItemTag.serviceItemTagValue.toString(), "utf8").toString("hex")}`;
				});
			});
		}

		return { boxTagInfo, boxServiceItemInfo };
	}
}

module.exports = HubFunctions;