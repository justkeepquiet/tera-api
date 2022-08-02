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
	}

	//
	// OpArb functions
	//

	/**
	 * @return {Promise<opArb.opmsg>}
	 */
	opMsg(opMsg, serverId, funcName) {
		return this.sendMessage(serverId, 1, opArb.opmsg, opArb.opmsg, opMsg, "OpArb", funcName).then(data => { // 1: opmsg
			const resultCode = readGuid(data.resultCode);

			if (resultCode.number === this.opMsgResultCode.success) {
				return Promise.resolve(data);
			} else {
				return Promise.reject(
					new HubError(`OpArb.${opArb.opmsg.name}.${funcName}: ${resultCode.category}:${resultCode.number}`, data.resultCode)
				);
			}
		});
	}

	/**
	 * @return {Promise<opArb.KickUserAns>}
	 */
	kickUser(serverId, userSrl, kickCode) {
		return this.sendMessage(serverId, 2, opArb.KickUserReq, opArb.KickUserAns,
			{ userSrl, kickCode }, "OpArb"); // 2: KickUserReq
	}

	/**
	 * @return {Promise<opArb.SendMessageAns>}
	 */
	sendMsg(serverId, userSrl, message) {
		return this.sendMessage(serverId, 4, opArb.SendMessageReq, opArb.SendMessageAns,
			{ userSrl, message: Buffer.from(message.toString(), "utf16le") }, "OpArb"); // 4: SendMessageReq
	}

	/**
	 * @return {Promise<opArb.BulkKickAns>}
	 */
	bulkKick(serverId, kickCode, filter = 0, filterMask = 0) {
		return this.sendMessage(serverId, 6, opArb.BulkKickReq, opArb.BulkKickAns,
			{ kickCode, filter, filterMask }, "OpArb"); // 6: BulkKickReq
	}

	/**
	 * @return {Promise<opArb.BoxNotiUserAns>}
	 */
	boxNotiUser(serverId, userSrl, charSrl = 0) {
		return this.sendMessage(serverId, 15, opArb.BoxNotiUserReq, opArb.BoxNotiUserAns,
			{ serverId, userSrl, charSrl }, "OpArb");// 15: BoxNotiUserReq
	}

	/**
	 * @return {Promise<opArb.AddBenefitAns>}
	 */
	addBenefit(serverId, userSrl, benefitId, remainSec) {
		return this.sendMessage(serverId, 38, opArb.AddBenefitReq, opArb.AddBenefitAns,
			{ userSrl, benefitId, remainSec }, "OpArb"); // 38: AddBenefitReq
	}

	/**
	 * @return {Promise<opArb.RemoveBenefitAns>}
	 */
	removeBenefit(serverId, userSrl, benefitId) {
		return this.sendMessage(serverId, 40, opArb.RemoveBenefitReq, opArb.RemoveBenefitAns,
			{ userSrl, benefitId }, "OpArb"); // 40: RemoveBenefitReq
	}

	//
	// OpUent functions
	//

	/**
	 * @return {Promise<opUent.QueryUserAns>}
	 */
	queryUser(userSrl, action = 0, serverId = 0) {
		return this.sendMessage(gusid.userenter, 1, opUent.QueryUserReq, opUent.QueryUserAns,
			{ userSrl, action, serverId }, "OpUent"); // 1: QueryUserReq
	}

	/**
	 * @return {Promise<opUent.GetServerStatAns>}
	 */
	getServerStat() {
		return this.sendMessage(gusid.userenter, 3, opUent.GetServerStatReq, opUent.GetServerStatAns,
			{}, "OpUent"); // 3: GetServerStatReq
	}

	/**
	 * @return {Promise<opUent.GetAllServerStatAns>}
	 */
	getAllServerStat(serverCat) {
		return this.sendMessage(gusid.userenter, 5, opUent.GetAllServerStatReq, opUent.GetAllServerStatAns,
			{ serverCat }, "OpUent"); // 5: GetAllServerStatReq
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

		return this.opMsg(opMsg, gusid.boxapi, "CreateBox").then(data =>
			Promise.resolve(Buffer.from(data.resultScalar).toString())
		);
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

		return this.opMsg(opMsg, gusid.boxapi, "GetServiceItem").then(data => {
			const resultSets = [];

			data.resultSets[0].rows.forEach(row => {
				const resultSet = {};

				row.values.forEach((value, column) =>
					resultSet[data.resultSets[0].columnNames[column].toString()] = value.toString()
				);

				resultSets.push(resultSet);
			});

			return Promise.resolve(resultSets);
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

		return this.opMsg(opMsg, gusid.boxapi, "CreateServiceItem").then(data =>
			Promise.resolve(Buffer.from(data.resultScalar).toString())
		);
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

		return this.opMsg(opMsg, gusid.boxapi, "SetDisableServiceItem").then(data =>
			Promise.resolve()
		);
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