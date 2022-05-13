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
  `availableUntil` int(11) NOT NULL DEFAULT '1907407069',
  PRIMARY KEY (`accountDBID`,`benefitId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_characters` (
  `accountDBID` bigint(20) NOT NULL,
  `serverID` int(11) NOT NULL,
  `charCount` int(11) DEFAULT '0',
  PRIMARY KEY (`accountDBID`,`serverID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_info` (
  `accountDBID` bigint(20) NOT NULL AUTO_INCREMENT,
  `userName` varchar(64) NOT NULL,
  `passWord` varchar(128) NOT NULL,
  `RMB` int(11) NOT NULL DEFAULT '0',
  `authKey` varchar(128) DEFAULT NULL,
  `registerTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastLoginTime` int(11) NOT NULL DEFAULT '0',
  `lastLoginIP` varchar(64) DEFAULT NULL,
  `playTimeLast` int(11) NOT NULL DEFAULT '0',
  `playTimeTotal` int(11) NOT NULL DEFAULT '0',
  `playCount` int(11) NOT NULL DEFAULT '0',
  `permission` int(11) NOT NULL DEFAULT '0',
  `privilege` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`accountDBID`,`userName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=990000000 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

CREATE TABLE IF NOT EXISTS `report_cheats` (
  `accountDBID` bigint(20) DEFAULT NULL,
  `serverId` int(11) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `cheatInfo` varchar(1024) DEFAULT NULL,
  `reportTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `accountDBID` (`accountDBID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
