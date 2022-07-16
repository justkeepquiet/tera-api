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
  `active` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`accountDBID`),
  FULLTEXT KEY `ip` (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_benefits` (
  `accountDBID` bigint(20) NOT NULL,
  `benefitId` int(11) NOT NULL,
  `availableUntil` datetime NOT NULL,
  PRIMARY KEY (`accountDBID`,`benefitId`)
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
  PRIMARY KEY (`characterId`,`serverId`,`accountDBID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_info` (
  `accountDBID` bigint(20) NOT NULL AUTO_INCREMENT,
  `userName` varchar(64) NOT NULL,
  `passWord` varchar(128) NOT NULL,
  `authKey` varchar(128) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  `registerTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastLoginTime` timestamp NULL DEFAULT NULL,
  `lastLoginIP` varchar(64) DEFAULT NULL,
  `lastLoginServer` int(11) DEFAULT NULL,
  `playTimeLast` int(11) NOT NULL DEFAULT '0',
  `playTimeTotal` int(11) NOT NULL DEFAULT '0',
  `playCount` int(11) NOT NULL DEFAULT '0',
  `permission` int(11) NOT NULL DEFAULT '0',
  `privilege` int(11) NOT NULL DEFAULT '0',
  `language` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`accountDBID`,`userName`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `account_online` (
  `accountDBID` bigint(20) NOT NULL,
  `serverId` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`accountDBID`,`serverId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `queue_tasks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tag` varchar(256) DEFAULT NULL,
  `handler` varchar(256) NOT NULL,
  `arguments` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `message` text,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tag` (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_activity` (
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `playTime` int(11) DEFAULT NULL,
  `reportType` int(11) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `accountDBID` (`accountDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_boxes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) NOT NULL,
  `serverId` int(11) DEFAULT NULL,
  `characterId` int(11) DEFAULT NULL,
  `logId` int(11) DEFAULT NULL,
  `context` text NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_characters` (
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
  KEY `accountDBID` (`accountDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_cheats` (
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `cheatInfo` varchar(1024) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `accountDBID` (`accountDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_chronoscrolls` (
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `chronoId` int(11) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `accountDBID` (`accountDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_shop_fund` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) NOT NULL,
  `amount` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `report_shop_pay` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) NOT NULL,
  `ip` varchar(64) NOT NULL,
  `boxId` bigint(20) DEFAULT NULL,
  `productId` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `status` varchar(16) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `server_info` (
  `serverId` int(11) NOT NULL,
  `loginIp` varchar(64) DEFAULT NULL,
  `loginPort` int(11) DEFAULT NULL,
  `language` varchar(3) DEFAULT NULL,
  `nameString` varchar(256) DEFAULT NULL,
  `descrString` varchar(1024) DEFAULT NULL,
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
  PRIMARY KEY (`id`)
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

INSERT IGNORE INTO `server_strings` (`language`, `categoryPvE`, `categoryPvP`, `serverOffline`, `serverLow`, `serverMedium`, `serverHigh`, `crowdNo`, `crowdYes`, `popup`) VALUES
	('en', 'PvE', 'PvP', 'Offline', 'Low', 'Medium', 'High', 'No', 'Yes', 'Unable to access the server at this time.'),
	('ru', 'PvE', 'PvP', 'Отключен', 'Низко', 'Средне', 'Высоко', 'Нет', 'Да', 'В настоящее время невозможно войти на сервер.'),
	('tw', 'PvE', 'PvP', '离线', '低的', '中间', '高的', '不', '是的', '此时无法访问服务器。');

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
