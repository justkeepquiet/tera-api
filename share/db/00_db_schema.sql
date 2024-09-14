/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `account_bans` (
  `accountDBID` bigint(20) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `ip` text,
  `description` text,
  `active` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`accountDBID`),
  KEY `active` (`active`),
  KEY `startTime` (`startTime`),
  KEY `endTime` (`endTime`),
  FULLTEXT KEY `ip` (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_benefits` (
  `accountDBID` bigint(20) NOT NULL,
  `benefitId` int(11) NOT NULL,
  `availableUntil` datetime NOT NULL,
  PRIMARY KEY (`accountDBID`,`benefitId`),
  KEY `availableUntil` (`availableUntil`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_characters` (
  `characterId` int(11) NOT NULL,
  `serverId` int(11) NOT NULL,
  `accountDBID` bigint(20) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL,
  `genderId` int(11) DEFAULT NULL,
  `raceId` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`characterId`,`serverId`,`accountDBID`) USING BTREE,
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_info` (
  `accountDBID` bigint(20) NOT NULL AUTO_INCREMENT,
  `userName` varchar(64) NOT NULL,
  `passWord` varchar(128) NOT NULL,
  `authKey` varchar(128) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  `registerTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lastLoginTime` timestamp NULL DEFAULT NULL,
  `lastLoginIP` varchar(64) DEFAULT NULL,
  `lastLoginServer` int(11) DEFAULT NULL,
  `playTimeLast` int(11) NOT NULL DEFAULT '0',
  `playTimeTotal` int(11) NOT NULL DEFAULT '0',
  `playCount` int(11) NOT NULL DEFAULT '0',
  `permission` int(11) NOT NULL DEFAULT '0',
  `privilege` int(11) NOT NULL DEFAULT '0',
  `language` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`accountDBID`) USING BTREE,
  KEY `authKey` (`authKey`),
  UNIQUE `userName` (`userName`),
  UNIQUE `email` (`email`),
  KEY `passWord` (`passWord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `account_online` (
  `accountDBID` bigint(20) NOT NULL,
  `serverId` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`accountDBID`,`serverId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_reset_password` (
  `token` varchar(128) NOT NULL,
  `email` varchar(64) NOT NULL,
  `code` varchar(6) DEFAULT NULL,
  `failsCount` int(11) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`,`email`),
  KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_verify` (
  `token` varchar(128) NOT NULL,
  `email` varchar(64) NOT NULL,
  `code` varchar(6) DEFAULT NULL,
  `failsCount` int(11) NOT NULL DEFAULT '0',
  `userName` varchar(64) DEFAULT NULL,
  `passWord` varchar(128) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`,`email`),
  KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `box_info` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `icon` varchar(255) NOT NULL,
  `title` varchar(1024) NOT NULL,
  `content` varchar(2048) NOT NULL,
  `days` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `box_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `boxId` bigint(20) NOT NULL,
  `itemTemplateId` bigint(20) NOT NULL,
  `boxItemId` int(11) DEFAULT NULL,
  `boxItemCount` int(11) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`boxId`,`itemTemplateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `data_item_conversions` (
  `itemTemplateId` bigint(20) NOT NULL,
  `fixedItemTemplateId` bigint(20) NOT NULL,
  `class` varchar(50) DEFAULT NULL,
  `race` varchar(50) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`itemTemplateId`,`fixedItemTemplateId`) USING BTREE,
  KEY `class` (`class`) USING BTREE,
  KEY `race` (`race`) USING BTREE,
  KEY `gender` (`gender`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `data_item_strings` (
  `language` varchar(3) NOT NULL,
  `itemTemplateId` bigint(20) NOT NULL,
  `string` varchar(2048) DEFAULT NULL,
  `toolTip` varchar(4096) DEFAULT NULL,
  PRIMARY KEY (`language`,`itemTemplateId`) USING BTREE,
  FULLTEXT KEY `string` (`string`),
  FULLTEXT KEY `toolTip` (`toolTip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `data_item_templates` (
  `itemTemplateId` bigint(20) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `rareGrade` int(11) NOT NULL,
  `requiredLevel` int(11) DEFAULT NULL,
  `requiredClass` varchar(255) DEFAULT NULL,
  `requiredGender` varchar(255) DEFAULT NULL,
  `requiredRace` varchar(255) DEFAULT NULL,
  `warehouseStorable` tinyint(4) DEFAULT NULL,
  `tradable` tinyint(4) DEFAULT NULL,
  `boundType` varchar(255) DEFAULT NULL,
  `periodByWebAdmin` tinyint(4) DEFAULT NULL,
  `periodInMinute` int(11) DEFAULT NULL,
  `linkSkillId` bigint(20) DEFAULT NULL,
  `linkSkillPeriodDay` int(11) DEFAULT NULL,
  PRIMARY KEY (`itemTemplateId`) USING BTREE,
  KEY `linkSkillId` (`linkSkillId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `data_skill_icons` (
  `skillId` bigint(20) NOT NULL,
  `class` varchar(255) NOT NULL,
  `race` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `icon` varchar(2048) NOT NULL,
  PRIMARY KEY (`skillId`,`class`,`race`,`gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- launcher V2
CREATE TABLE IF NOT EXISTS `launcher_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `priority` int(11) NOT NULL DEFAULT '0',
  `image` varchar(2048) DEFAULT NULL,
  `link` varchar(4096) DEFAULT NULL,
  `panelColor` varchar(64) DEFAULT NULL,
  `panelIcon` varchar(64) DEFAULT NULL,
  `displayDateStart` datetime NULL DEFAULT NULL,
  `displayDateEnd` datetime NULL DEFAULT NULL,
  `timerStart` datetime NULL DEFAULT NULL,
  `timerEnd` datetime NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- launcher V2
CREATE TABLE IF NOT EXISTS `launcher_slide_strings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(3) NOT NULL,
  `slideId` int(11) NOT NULL,
  `title` varchar(1024) DEFAULT NULL,
  `description` text,
  `buttonText` varchar(1024) DEFAULT NULL,
  `panelSmall` varchar(256) DEFAULT NULL,
  `panelBig` varchar(256) DEFAULT NULL,
  `expiryText` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`language`,`slideId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `queue_tasks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tag` varchar(256) DEFAULT NULL,
  `handler` varchar(256) NOT NULL,
  `arguments` text NOT NULL,
  `status` int(11) NOT NULL,
  `message` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tag` (`tag`),
  KEY `status` (`status`),
  KEY `handler` (`handler`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_activity` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `playTime` int(11) DEFAULT NULL,
  `reportType` int(11) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `accountDBID` (`accountDBID`),
  KEY `serverId` (`serverId`),
  KEY `reportTime` (`reportTime`),
  KEY `reportType` (`reportType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_admin_op` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `userId` varchar(64) DEFAULT NULL,
  `userType` varchar(64) DEFAULT NULL,
  `userSn` bigint(20) DEFAULT NULL,
  `userTz` varchar(128) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `function` varchar(256) DEFAULT NULL,
  `payload` text,
  `reportType` int(11) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reportTime` (`reportTime`),
  KEY `userId` (`userId`),
  KEY `userType` (`userType`),
  KEY `userSn` (`userSn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_boxes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `boxId` bigint(20) DEFAULT NULL,
  `accountDBID` bigint(20) NOT NULL,
  `serverId` int(11) DEFAULT NULL,
  `characterId` int(11) DEFAULT NULL,
  `logType` int(11) DEFAULT NULL,
  `logId` bigint(20) DEFAULT NULL,
  `context` text NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `createdAt` (`createdAt`),
  KEY `logId` (`logId`),
  KEY `logType` (`logType`),
  KEY `accountDBID` (`accountDBID`),
  KEY `boxId` (`boxId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_characters` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) NOT NULL,
  `serverId` int(11) NOT NULL,
  `characterId` int(11) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL,
  `genderId` int(11) DEFAULT NULL,
  `raceId` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `reportType` int(11) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `accountDBID` (`accountDBID`),
  KEY `serverId` (`serverId`),
  KEY `characterId` (`characterId`),
  KEY `reportTime` (`reportTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_cheats` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `cheatInfo` varchar(1024) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `accountDBID` (`accountDBID`),
  KEY `serverId` (`serverId`),
  KEY `reportTime` (`reportTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_chronoscrolls` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `chronoId` int(11) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `accountDBID` (`accountDBID`),
  KEY `serverId` (`serverId`),
  KEY `reportTime` (`reportTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- launcher V2
CREATE TABLE IF NOT EXISTS `report_launcher` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) NULL DEFAULT NULL,
  `ip` varchar(64) NULL DEFAULT NULL,
  `action` varchar(64) NULL DEFAULT NULL,
  `label` varchar(128) NULL DEFAULT NULL,
  `optLabel` varchar(128) NULL DEFAULT NULL,
  `version` varchar(128) NULL DEFAULT NULL,
  `reportTime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `accountDBID` (`accountDBID`),
  INDEX `reportTime` (`reportTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_shop_fund` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) NOT NULL,
  `amount` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `accountDBID` (`accountDBID`),
  KEY `createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_shop_pay` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) NOT NULL,
  `serverId` int(11) NOT NULL,
  `ip` varchar(64) NOT NULL,
  `boxId` bigint(20) DEFAULT NULL,
  `productId` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `status` varchar(16) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `accountDBID` (`accountDBID`),
  KEY `serverId` (`serverId`),
  KEY `status` (`status`),
  KEY `createdAt` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `server_info` (
  `serverId` int(11) NOT NULL,
  `loginIp` varchar(64) DEFAULT NULL,
  `loginPort` int(11) DEFAULT NULL,
  `language` varchar(3) DEFAULT NULL,
  `nameString` varchar(256) DEFAULT NULL,
  `descrString` varchar(1024) DEFAULT NULL,
  `permission` int(11) DEFAULT '0',
  `tresholdLow` int(11) DEFAULT '50',
  `tresholdMedium` int(11) DEFAULT '100',
  `isPvE` tinyint(1) DEFAULT '0',
  `isCrowdness` tinyint(1) DEFAULT '0',
  `isAvailable` tinyint(1) DEFAULT '0',
  `isEnabled` tinyint(1) DEFAULT '1',
  `usersOnline` int(11) DEFAULT '0',
  `usersTotal` int(11) DEFAULT '0',
  PRIMARY KEY (`serverId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `server_maintenance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `startTime` (`startTime`),
  KEY `endTime` (`endTime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `server_strings` (
  `language` varchar(3) NOT NULL,
  `categoryPvE` varchar(50) DEFAULT NULL,
  `categoryPvP` varchar(50) DEFAULT NULL,
  `serverOffline` varchar(50) DEFAULT NULL,
  `serverLow` varchar(50) DEFAULT NULL,
  `serverMedium` varchar(50) DEFAULT NULL,
  `serverHigh` varchar(50) DEFAULT NULL,
  `crowdNo` varchar(50) DEFAULT NULL,
  `crowdYes` varchar(50) DEFAULT NULL,
  `popup` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_accounts` (
  `accountDBID` bigint(20) NOT NULL,
  `balance` int(11) DEFAULT '0',
  `active` tinyint(4) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`accountDBID`) USING BTREE,
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort` int(11) NOT NULL DEFAULT '0',
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_category_strings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(3) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `title` varchar(1024) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`language`,`categoryId`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `rareGrade` int(11) DEFAULT NULL,
  `validAfter` datetime NOT NULL,
  `validBefore` datetime NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  KEY `active` (`active`),
  KEY `validAfter` (`validAfter`),
  KEY `validBefore` (`validBefore`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_product_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `productId` bigint(20) NOT NULL,
  `itemTemplateId` bigint(20) NOT NULL,
  `boxItemId` int(11) DEFAULT NULL,
  `boxItemCount` int(11) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`productId`,`itemTemplateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_product_strings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `language` varchar(3) NOT NULL,
  `productId` bigint(20) NOT NULL,
  `title` varchar(2048) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`language`,`productId`) USING BTREE,
  FULLTEXT KEY `title` (`title`),
  FULLTEXT KEY `description` (`description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_promocodes` (
  `promoCodeId` int(11) NOT NULL AUTO_INCREMENT,
  `promoCode` varchar(255) NOT NULL,
  `function` varchar(255) NOT NULL,
  `validAfter` datetime NOT NULL,
  `validBefore` datetime NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`promoCodeId`) USING BTREE,
  UNIQUE KEY `promoCode` (`promoCode`),
  KEY `validAfter` (`validAfter`),
  KEY `validBefore` (`validBefore`),
  KEY `active` (`active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_promocode_activated` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `promoCodeId` int(11) NOT NULL,
  `accountDBID` bigint(20) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `promoCodeId` (`promoCodeId`,`accountDBID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_promocode_strings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(3) NOT NULL,
  `promoCodeId` int(11) NOT NULL,
  `description` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`language`,`promoCodeId`) USING BTREE,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
