"use strict";

const OpMsg = require("./protobuf/opMsg").op.OpMsg;
const PlatformError = require("./platformError");
const PlatformConnection = require("./platformConnection");

class PlatformFunctions extends PlatformConnection {
	constructor(platformAddr, platformPort, serviceId, params = { logger: null }) {
		super(platformAddr, platformPort, params);

		this.serviceId = serviceId;
	}

	getServiceItem(serviceItemSN) {
		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.boxapi, 116), // GetServiceItem
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
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

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.platformErrorCode.success) {
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
				return Promise.reject(new PlatformError(`Platform Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	createServiceItem(platformUserSN, itemMappingSN, serviceSN, startActivationTime, enableFlag = true,
		itemName = "", itemDescription = "", tagData = null
	) {
		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.boxapi, 117), // CreateServiceItem
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
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

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.platformErrorCode.success) {
				return Promise.resolve(Buffer.from(data.resultScalar).toString());
			} else {
				return Promise.reject(new PlatformError(`Platform Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	removeServiceItem(serviceItemSN) {
		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.boxapi, 118), // SetDisableServiceItem
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
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

		return this.sendAndRecv(opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.platformErrorCode.success) {
				return Promise.resolve();
			} else {
				return Promise.reject(new PlatformError(`Platform Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	createBox(receiverServiceSN, receiverUserSN, startDate, endDate, visibleFlag, itemData, boxTagData,
		receiverGUSID = null, receiverCharacterSN = null, receiverCharacterName = null, usableTimeAfterOpen = null
	) {
		const { boxTagInfo, boxServiceItemInfo } = this.convertBoxTagValue(boxTagData, itemData);

		const opMsg = OpMsg.create({
			gufid: this.makeGuid(this.serverType.boxapi, 107), // CreateBox
			senderGusid: this.makeGuid(this.serviceId, this.uniqueServerId),
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
					value: Buffer.from(receiverGUSID.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("receiverCharacterSN"),
					value: Buffer.from(receiverCharacterSN.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("receiverCharacterName"),
					value: Buffer.from(receiverCharacterName.toString())
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
					value: Buffer.from("")
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
					name: Buffer.from("endActivationDateTime"),
					value: Buffer.from(endDate.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("activateDurationAfterOpen"),
					value: Buffer.from(usableTimeAfterOpen.toString())
				}),
				OpMsg.Argument.create({
					name: Buffer.from("visableFlagBeforeActivation"),
					value: Buffer.from(visibleFlag.toString())
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
				})
			]
		});

		return this.sendAndRecv(this.socket, opMsg).then(data => {
			const resultCode = this.getErrorCode(data.resultCode);

			if (resultCode === this.platformErrorCode.success) {
				return Promise.resolve(data.resultScalar);
			} else {
				return Promise.reject(new PlatformError(`Platform Error: ${resultCode}`, data.resultCode));
			}
		});
	}

	convertBoxTagValue(boxTagInfoList, boxItemTagInfoList) {
		let boxTagInfo = "";
		let boxTagItemInfo = "";

		if (boxTagInfoList.length > 0) {
			boxTagInfo += boxTagInfoList.length.toString();

			boxTagInfoList.forEarch(boxTag => {
				boxTagInfo += `,${boxTag.boxTagSN},${boxTag.boxTagValue}`;
			});
		}

		if (boxItemTagInfoList.length > 0) {
			boxTagItemInfo += boxItemTagInfoList.length.toString();

			boxItemTagInfoList.forEarch(boxItemTag => {
				boxTagItemInfo += `,${boxItemTag.serviceItemSN},${boxItemTag.externalItemKey}`;
				boxTagItemInfo += `,${boxItemTag.serviceItemTag.length}`;

				boxItemTag.serviceItemTag.forEarch(serviceItemTag => {
					boxTagItemInfo += `,${serviceItemTag.serviceItemTagSN},${serviceItemTag.serviceItemTagValue}`;
				});
			});
		}

		return { boxTagInfo, boxTagItemInfo };
	}
}

module.exports = PlatformFunctions;