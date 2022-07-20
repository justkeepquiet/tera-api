"use strict";

const moment = require("moment-timezone");
const OpMsg = require("./protobuf/opMsg").op.OpMsg;
const PlatformError = require("./platformError");
const PlatformConnection = require("./platformConnection");

class PlatformFunctions extends PlatformConnection {
	constructor(platformAddr, platformPort, serviceId, params = { logger: null }) {
		super(platformAddr, platformPort, params);

		this.serviceId = serviceId;
	}

	//
	// BoxAPI Functions
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

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.boxapi, 107), // CreateBox
			senderGusid: this.makeGuid(this.serviceId, 0),
			receiverGusid: this.makeGuid(this.serverType.boxapi, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("receiverServiceSN"),
					value: Buffer.from(receiverServiceSN.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("receiverUserSN"),
					value: Buffer.from(receiverUserSN.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("receiverGUSID"),
					value: Buffer.from(receiverGUSID ? receiverGUSID.toString() : "")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("receiverCharacterSN"),
					value: Buffer.from(receiverCharacterSN ? receiverCharacterSN.toString() : "")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("receiverCharacterName"),
					value: Buffer.from(receiverCharacterName ? receiverCharacterName.toString() : "")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("senderUserSN"),
					value: Buffer.from("")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("senderGUSID"),
					value: Buffer.from("")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("senderCharacterSN"),
					value: Buffer.from("")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("senderCharacterName"),
					value: Buffer.from("")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("createEndPointCode"),
					value: Buffer.from(this.serviceId.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("externalTransactionKey"),
					value: Buffer.from(externalTransactionKey ? externalTransactionKey.toString() : "")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("startActivationDateTime"),
					value: Buffer.from(startDate.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("endActivationDateTime"),
					value: Buffer.from(endDate.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("activateDurationAfterOpen"),
					value: Buffer.from(usableTimeAfterOpen ? usableTimeAfterOpen.toString() : "")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("visableFlagBeforeActivation"),
					value: Buffer.from(Number(visibleFlag).toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("boxEventSN"),
					value: Buffer.from("")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("boxTagInfo"),
					value: Buffer.from(boxTagInfo)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("boxServiceItemInfo"),
					value: Buffer.from(boxServiceItemInfo)
				}),
				OpMsg.Argument.create({
					name: Buffer.from("boxTransactionSN"),
					value: Buffer.from("")
				})
			]
		});

		return this.sendAndRecv(opMsg, this.gusid.boxapi).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.platformResultCode.success) {
				return Promise.resolve(Buffer.from(data.resultScalar).toString());
			} else {
				return Promise.reject(new PlatformError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	getServiceItem(serviceItemSN) {
		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.boxapi, 116), // GetServiceItem
			senderGusid: this.makeGuid(this.serviceId, 0),
			receiverGusid: this.makeGuid(this.serverType.boxapi, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemSN"),
					value: Buffer.from(serviceItemSN.toString())
				})
			]
		});

		return this.sendAndRecv(opMsg, this.gusid.boxapi).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.platformResultCode.success) {
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
				return Promise.reject(new PlatformError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	createServiceItem(platformUserSN, itemMappingSN, serviceSN, startActivationTime, enableFlag = true,
		itemName = "", itemDescription = "", tagData = null
	) {
		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.boxapi, 117), // CreateServiceItem
			senderGusid: this.makeGuid(this.serviceId, 0),
			receiverGusid: this.makeGuid(this.serverType.boxapi, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemServiceSN"),
					value: Buffer.from(serviceSN.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemMappingItemSN"),
					value: Buffer.from(itemMappingSN.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemStartActivationDateTime"),
					value: Buffer.from(startActivationTime.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemEnableFlag"),
					value: Buffer.from(enableFlag ? "1" : "0")
				}),
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemName"),
					value: Buffer.from(itemName.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemDescription"),
					value: Buffer.from(itemDescription.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemRegisterUserSN"),
					value: Buffer.from(platformUserSN.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemTagInfo"),
					value: Buffer.from(tagData ? tagData : "0")
				})
			]
		});

		return this.sendAndRecv(opMsg, this.gusid.boxapi).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.platformResultCode.success) {
				return Promise.resolve(Buffer.from(data.resultScalar).toString());
			} else {
				return Promise.reject(new PlatformError(`Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	removeServiceItem(serviceItemSN) {
		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.boxapi, 118), // SetDisableServiceItem
			senderGusid: this.makeGuid(this.serviceId, 0),
			receiverGusid: this.makeGuid(this.serverType.boxapi, 0),
			execType: OpMsg.ExecType.EXECUTE,
			jobType: OpMsg.JobType.REQUEST,

			arguments: [
				OpMsg.Argument.create({
					name: Buffer.from("serviceItemSN"),
					value: Buffer.from(serviceItemSN.toString())
				})
			]
		});

		return this.sendAndRecv(opMsg, this.gusid.boxapi).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.platformResultCode.success) {
				return Promise.resolve();
			} else {
				return Promise.reject(new PlatformError(`Error: ${resultCode}`, data.resultCode));
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

module.exports = PlatformFunctions;