/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `shop_accounts` (
  `accountDBID` bigint(20) NOT NULL,
  `balance` int(11) DEFAULT '0',
  `active` tinyint(4) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`accountDBID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sort` int(11) NOT NULL DEFAULT '1',
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
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

CREATE TABLE IF NOT EXISTS `shop_fund_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `accountDBID` bigint(20) NOT NULL,
  `amount` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_item_conversions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `itemTemplateId` bigint(20) NOT NULL,
  `fixedItemTemplateId` bigint(20) NOT NULL,
  `class` varchar(50) DEFAULT NULL,
  `race` varchar(50) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`itemTemplateId`,`fixedItemTemplateId`) USING BTREE,
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_item_strings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(3) NOT NULL,
  `itemTemplateId` bigint(20) NOT NULL,
  `string` varchar(2048) DEFAULT NULL,
  `toolTip` varchar(4096) DEFAULT NULL,
  PRIMARY KEY (`language`,`itemTemplateId`) USING BTREE,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_item_templates` (
  `itemTemplateId` bigint(20) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `rareGrade` int(11) NOT NULL,
  `requiredLevel` int(11) DEFAULT NULL,
  `requiredClass` varchar(255) DEFAULT NULL,
  `requiredGender` varchar(255) DEFAULT NULL,
  `requiredRace` varchar(255) DEFAULT NULL,
  `warehouseStorable` tinyint(4) DEFAULT NULL,
  `tradable` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`itemTemplateId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_pay_logs` (
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

CREATE TABLE IF NOT EXISTS `shop_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `rareGrade` int(11) DEFAULT NULL,
  `validAfter` datetime NOT NULL,
  `validBefore` datetime NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `active` tinyint(4) DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_product_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `itemTemplateId` int(11) NOT NULL,
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
  `productId` int(11) NOT NULL,
  `title` varchar(1024) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`language`,`productId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_promocodes` (
  `promoCodeId` int(11) NOT NULL AUTO_INCREMENT,
  `promoCode` varchar(255) NOT NULL,
  `function` varchar(255) NOT NULL,
  `validAfter` datetime NOT NULL,
  `validBefore` datetime NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`promoCodeId`) USING BTREE,
  UNIQUE KEY `promoCode` (`promoCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_promocode_activated` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `promoCodeId` int(11) NOT NULL,
  `accountDBID` bigint(20) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `promoCodeId` (`promoCodeId`,`accountDBID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `shop_promocode_strings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` varchar(3) NOT NULL,
  `promoCodeId` bigint(20) NOT NULL,
  `description` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`language`,`promoCodeId`) USING BTREE,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
