/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `accountdb` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `accountdb`;

CREATE TABLE IF NOT EXISTS `account_benefits` (
  `accountDBID` bigint(20) NOT NULL,
  `benefitId` int(11) NOT NULL,
  `availableUntil` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`accountDBID`,`benefitId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40000 ALTER TABLE `account_benefits` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_benefits` ENABLE KEYS */;

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

/*!40000 ALTER TABLE `account_characters` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_characters` ENABLE KEYS */;

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
  PRIMARY KEY (`accountDBID`,`userName`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

/*!40000 ALTER TABLE `account_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `account_info` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `report_activity` (
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `playTime` int(11) DEFAULT NULL,
  `reportType` int(11) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `accountDBID` (`accountDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40000 ALTER TABLE `report_activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_activity` ENABLE KEYS */;

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

/*!40000 ALTER TABLE `report_characters` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_characters` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `report_cheats` (
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `cheatInfo` varchar(1024) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `accountDBID` (`accountDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40000 ALTER TABLE `report_cheats` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_cheats` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `report_chronoscrolls` (
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `chronoId` int(11) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `accountDBID` (`accountDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40000 ALTER TABLE `report_chronoscrolls` DISABLE KEYS */;
/*!40000 ALTER TABLE `report_chronoscrolls` ENABLE KEYS */;

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

/*!40000 ALTER TABLE `server_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `server_info` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `server_maintenance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `startTime` timestamp NULL DEFAULT NULL,
  `endTime` timestamp NULL DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40000 ALTER TABLE `server_maintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `server_maintenance` ENABLE KEYS */;

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

/*!40000 ALTER TABLE `server_strings` DISABLE KEYS */;
INSERT INTO `server_strings` (`language`, `categoryPvE`, `categoryPvP`, `serverOffline`, `serverLow`, `serverMedium`, `serverHigh`, `crowdNo`, `crowdYes`, `popup`) VALUES
	('en', 'PvE', 'PvP', 'Offline', 'Low', 'Medium', 'High', 'No', 'Yes', 'Unable to access the server at this time.'),
	('ru', 'PvE', 'PvP', '????????????????', '??????????', '????????????', '????????????', '??????', '????', '?? ?????????????????? ?????????? ???????????????????? ?????????? ???? ????????????.'),
	('tw', 'PvE', 'PvP', '??????', '??????', '??????', '??????', '???', '??????', '??????????????????????????????');
/*!40000 ALTER TABLE `server_strings` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
