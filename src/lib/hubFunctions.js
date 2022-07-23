"use strict";

const moment = require("moment-timezone");
const opArb = require("./protobuf/opArb").proto_oparb;
const opUent = require("./protobuf/opUent").proto_opuent;
const HubError = require("./hubError");
const HubConnection = require("./hubConnection");
const { gusid, serverCategory, makeGuid } = require("./teraPlatformGuid");

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
	// BoxAPI functions
	//

	createBoxFromContext(boxContext, receiverUserSN, receiverGUSID = null, receiverCharacterSN = null, externalTransactionKey = null) {
		const startDate = moment().utc().format("YYYY-MM-DD HH:mm:ss");
		const endDate = moment().utc().add(boxContext.days, "days").format("YYYY-MM-DD HH:mm:ss");

		const itemData = [];
		const boxTagData = [
			{ boxTagSN: 1, boxTagValue: boxContext.content },
			{ boxTagSN: 2, boxTagValue: boxContext.title },
			{ boxTagSN: 3, boxTagValue: boxContext.icon }
		];

		boxContext.items.forEach(item =>
			itemData.push({
				serviceItemSN: item.item_id,
				externalItemKey: 0,
				serviceItemTag: [
					{ serviceItemTagSN: 1, serviceItemTagValue: item.item_count }
				]
			})
		);

		return this.createBox(1, receiverUserSN, startDate, endDate, true, itemData, boxTagData,
			receiverGUSID, receiverCharacterSN, null, null, externalTransactionKey
		);
	}

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
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.opMsgResultCode.success) {
				return Promise.resolve(Buffer.from(data.resultScalar).toString());
			} else {
				return Promise.reject(new HubError(`Error: ${resultCode}`, data.resultCode));
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
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.opMsgResultCode.success) {
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
				return Promise.reject(new HubError(`Error: ${resultCode}`, data.resultCode));
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
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.opMsgResultCode.success) {
				return Promise.resolve(Buffer.from(data.resultScalar).toString());
			} else {
				return Promise.reject(new HubError(`Error: ${resultCode}`, data.resultCode));
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
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.opMsgResultCode.success) {
				return Promise.resolve();
			} else {
				return Promise.reject(new HubError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	//
	// OpArb functions
	//

	kickUser(serverId, userSrl, kickCode) {
		const msg = opArb.KickUserReq.encode({ userSrl, kickCode }).finish();

		return this.sendMessage(serverId, 2, msg).then(data => { // 2: KickUserReq
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opArb.KickUserAns.decode(data.msgBuf)
			);
		});
	}

	sendMsg(serverId, userSrl, message) {
		const msg = opArb.SendMessageReq.encode({ userSrl, message: Buffer.from(message.toString(), "utf16le") }).finish();

		return this.sendMessage(serverId, 4, msg).then(data => { // 4: SendMessageReq
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opArb.SendMessageAns.decode(data.msgBuf)
			);
		});
	}

	bulkKick(serverId, kickCode, filter = 0, filterMask = 0) {
		const msg = opArb.BulkKickReq.encode({ kickCode, filter, filterMask }).finish();

		return this.sendMessage(serverId, 6, msg).then(data => { // 6: BulkKickReq
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opArb.BulkKickAns.decode(data.msgBuf)
			);
		});
	}

	boxNotiUser(serverId, userSrl, charSrl = 0) {
		const msg = opArb.BoxNotiUserReq.encode({ serverId, userSrl, charSrl }).finish();

		return this.sendMessage(serverId, 15, msg).then(data => { // 15: BoxNotiUserReq
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opArb.BoxNotiUserAns.decode(data.msgBuf)
			);
		});
	}

	addBenefit(serverId, userSrl, benefitId, remainSec) {
		const msg = opArb.AddBenefitReq.encode({ userSrl, benefitId, remainSec }).finish();

		return this.sendMessage(serverId, 38, msg).then(data => { // 38: AddBenefitReq
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opArb.AddBenefitAns.decode(data.msgBuf)
			);
		});
	}

	removeBenefit(serverId, userSrl, benefitId) {
		const msg = opArb.RemoveBenefitReq.encode({ userSrl, benefitId }).finish();

		return this.sendMessage(serverId, 40, msg).then(data => { // 40: RemoveBenefitReq
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opArb.RemoveBenefitAns.decode(data.msgBuf)
			);
		});
	}

	//
	// OpUent functions
	//

	queryUser(userSrl, action = 0, serverId = 0) {
		const msg = opUent.QueryUserReq.encode({ userSrl, action, serverId }).finish();

		return this.sendMessage(gusid.userenter, 1, msg).then(data => { // 1: QueryUserReq
			console.log(data);
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opUent.QueryUserAns.decode(data.msgBuf)
			);
		});
	}

	getServerStat() {
		const msg = opUent.GetServerStatReq.encode().finish();

		return this.sendMessage(gusid.userenter, 3, msg).then(data => { // 3: GetServerStatReq
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opUent.GetServerStatAns.decode(data.msgBuf)
			);
		});
	}

	getAllServerStat(serverCat) {
		const msg = opUent.GetAllServerStatReq.encode({ serverCat }).finish();

		return this.sendMessage(gusid.userenter, 5, msg).then(data => { // 5: GetAllServerStatReq
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opUent.GetAllServerStatAns.decode(data.msgBuf)
			);
		});
	}

	//
	// OpMsg
	//

	opMsg(opMsg, serverId) {
		const msg = opArb.opmsg.encode(opMsg).finish();

		return this.sendMessage(serverId, 1, msg).then(data => { // 1: OpMsg
			if (data === null) {
				return Promise.reject(new HubError("Fail"));
			}

			return Promise.resolve(
				opArb.opmsg.decode(data.msgBuf)
			);
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