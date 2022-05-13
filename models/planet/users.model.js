"use strict";

/**
* @typedef {import("sequelize").Sequelize} Sequelize
* @typedef {import("sequelize/types")} DataTypes
*/

/**
* @param {Sequelize} sequelize
* @param {DataTypes} DataTypes
*/
module.exports = (sequelize, DataTypes) =>
	sequelize.define("Users", {
		"accountDBID": {
			"type": DataTypes.BIGINT,
			"primaryKey": true
		},
		"accountName": {
			"type": DataTypes.STRING(50)
		},
		"userDBID": {
			"type": DataTypes.INTEGER
		},
		"userName": {
			"type": DataTypes.STRING(64)
		},
		"money": {
			"type": DataTypes.BIGINT
		},
		"userStat": {
			"type": DataTypes.INTEGER
		},
		"lastEnterWorld": {
			"type": DataTypes.DATE
		},
		"lastLeaveWorld": {
			"type": DataTypes.DATE
		},
		"lastUpdateTime": {
			"type": DataTypes.DATE
		},
		"profMineral": {
			"type": DataTypes.INTEGER
		},
		"profBug": {
			"type": DataTypes.INTEGER
		},
		"profEnergy": {
			"type": DataTypes.INTEGER
		},
		"profHerb": {
			"type": DataTypes.INTEGER
		},
		"profPet": {
			"type": DataTypes.SMALLINT
		},
		"license": {
			"type": DataTypes.INTEGER
		},
		"userLevel": {
			"type": DataTypes.INTEGER
		},
		"hp": {
			"type": DataTypes.INTEGER
		},
		"mp": {
			"type": DataTypes.INTEGER
		},
		"posX": {
			"type": DataTypes.FLOAT
		},
		"posY": {
			"type": DataTypes.FLOAT
		},
		"posZ": {
			"type": DataTypes.FLOAT
		},
		"isAlive": {
			"type": DataTypes.TINYINT
		},
		"worldId": {
			"type": DataTypes.INTEGER
		},
		"channelInstanceId": {
			"type": DataTypes.INTEGER
		},
		"deletionStatus": {
			"type": DataTypes.INTEGER
		},
		"deletionTime": {
			"type": DataTypes.DATE
		},
		"race": {
			"type": DataTypes.INTEGER
		},
		"gender": {
			"type": DataTypes.INTEGER
		},
		"class": {
			"type": DataTypes.INTEGER
		},
		"guildDbId": {
			"type": DataTypes.INTEGER
		},
		"guildGroupId": {
			"type": DataTypes.INTEGER
		},
		"condition": {
			"type": DataTypes.FLOAT
		},
		"pkDeclareCount": {
			"type": DataTypes.INTEGER
		},
		"pkPoint": {
			"type": DataTypes.INTEGER
		},
		"bfWinCount": {
			"type": DataTypes.INTEGER
		},
		"bfLoseCount": {
			"type": DataTypes.INTEGER
		},
		"bfDesertionCount": {
			"type": DataTypes.INTEGER
		},
		"warPoint": {
			"type": DataTypes.INTEGER
		},
		"sysReturnLandId": {
			"type": DataTypes.INTEGER
		},
		"sysReturnChannelInstanceId": {
			"type": DataTypes.INTEGER
		},
		"sysReturnPosX": {
			"type": DataTypes.INTEGER
		},
		"sysReturnPosY": {
			"type": DataTypes.INTEGER
		},
		"sysReturnPosZ": {
			"type": DataTypes.INTEGER
		},
		"incubationStartTime": {
			"type": DataTypes.BIGINT
		},
		"incubationSlot0": {
			"type": DataTypes.INTEGER
		},
		"incubationSlot1": {
			"type": DataTypes.INTEGER
		},
		"incubationSlot2": {
			"type": DataTypes.INTEGER
		},
		"incubationSlot3": {
			"type": DataTypes.INTEGER
		},
		"incubationSlot4": {
			"type": DataTypes.INTEGER
		},
		"incubationStatus": {
			"type": DataTypes.INTEGER
		},
		"pegasusId": {
			"type": DataTypes.INTEGER
		},
		"pegasusTime": {
			"type": DataTypes.INTEGER
		},
		"customizingField": {
			"type": DataTypes.BIGINT
		},
		"isPrisoner": {
			"type": DataTypes.TINYINT
		},
		"prisonDate": {
			"type": DataTypes.DATE
		},
		"isSecondCharacter": {
			"type": DataTypes.TINYINT
		},
		"lastWorldId": {
			"type": DataTypes.INTEGER
		},
		"lastGuardId": {
			"type": DataTypes.INTEGER
		},
		"lastSectionId": {
			"type": DataTypes.INTEGER
		},
		"direction": {
			"type": DataTypes.INTEGER
		},
		"playSec": {
			"type": DataTypes.INTEGER
		},
		"pegasusStage": {
			"type": DataTypes.TINYINT
		},
		"totalExp": {
			"type": DataTypes.BIGINT
		},
		"reviveRemainTime": {
			"type": DataTypes.INTEGER
		},
		"customizingInfo": {
			"type": DataTypes.STRING(32).BINARY
		},
		"adminLevel": {
			"type": DataTypes.INTEGER
		},
		"crestPoint": {
			"type": DataTypes.INTEGER
		},
		"titleId": {
			"type": DataTypes.INTEGER
		},
		"userIntroduce": {
			"type": DataTypes.STRING(40)
		},
		"loginStatus": {
			"type": DataTypes.INTEGER
		},
		"MaxInvenSlotCount": {
			"type": DataTypes.INTEGER
		},
		"expandInvenCount": {
			"type": DataTypes.INTEGER
		},
		"pocketCount": {
			"type": DataTypes.INTEGER
		},
		"description": {
			"type": DataTypes.STRING(50)
		},
		"canUseStatus": {
			"type": DataTypes.INTEGER
		},
		"pvpWinCount": {
			"type": DataTypes.INTEGER
		},
		"lastWeekPlayTime": {
			"type": DataTypes.INTEGER
		},
		"thisWeekPlayTime": {
			"type": DataTypes.INTEGER
		},
		"guildRecommendCount": {
			"type": DataTypes.INTEGER
		},
		"lastRecommendCountUpdateTime": {
			"type": DataTypes.DATE
		},
		"restBonusPoint": {
			"type": DataTypes.BIGINT
		},
		"stamina": {
			"type": DataTypes.INTEGER
		},
		"actPoint": {
			"type": DataTypes.INTEGER
		},
		"maxActPoint": {
			"type": DataTypes.INTEGER
		},
		"newPkPoint": {
			"type": DataTypes.INTEGER
		},
		"lastRestBonusApplyTime": {
			"type": DataTypes.DATE
		},
		"isFacialAttachment": {
			"type": DataTypes.BOOLEAN
		},
		"isTutorialPlaying": {
			"type": DataTypes.BOOLEAN
		},
		"observerType": {
			"type": DataTypes.INTEGER
		},
		"lastLeaveGuildTime": {
			"type": DataTypes.DATE
		},
		"lastJoinGuildTime": {
			"type": DataTypes.DATE
		},
		"showStyle": {
			"type": DataTypes.BOOLEAN
		},
		"friendProfile": {
			"type": DataTypes.STRING(40)
		},
		"lobbySlotId": {
			"type": DataTypes.INTEGER
		},
		"guildWeeklyContributionPoint": {
			"type": DataTypes.INTEGER
		},
		"guildTotalContributionPoint": {
			"type": DataTypes.BIGINT
		},
		"guildMemberClass": {
			"type": DataTypes.INTEGER
		},
		"awakenGrade": {
			"type": DataTypes.INTEGER
		},
		"equipItemLevel": {
			"type": DataTypes.INTEGER
		},
		"servantStorageSize": {
			"type": DataTypes.INTEGER
		},
		"servantHpPotionItemId": {
			"type": DataTypes.INTEGER
		},
		"servantHpPotionRate": {
			"type": DataTypes.INTEGER
		},
		"servantMpPotionItemId": {
			"type": DataTypes.INTEGER
		},
		"servantMpPotionRate": {
			"type": DataTypes.INTEGER
		},
		"servantAutoFeedItemId": {
			"type": DataTypes.INTEGER
		},
		"servantAutoFeedRate": {
			"type": DataTypes.INTEGER
		},
		"servantAutoPresentItemId": {
			"type": DataTypes.INTEGER
		},
		"servantAutoPresentRate": {
			"type": DataTypes.INTEGER
		}
	})
;