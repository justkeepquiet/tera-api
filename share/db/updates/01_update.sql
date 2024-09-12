
ALTER TABLE `account_info` CHANGE COLUMN `language` `language` VARCHAR(5) NULL DEFAULT NULL COLLATE 'utf8_general_ci' AFTER `privilege`;

ALTER TABLE `account_info` DROP PRIMARY KEY, ADD PRIMARY KEY (`accountDBID`) USING BTREE, ADD UNIQUE INDEX `userName` (`userName`), ADD UNIQUE INDEX `email` (`email`) ;
ALTER TABLE `account_info` DROP INDEX `authKey`, ADD UNIQUE INDEX `authKey` (`authKey`) USING BTREE;

ALTER TABLE `report_activity` ADD COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);
ALTER TABLE `report_characters` ADD COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);
ALTER TABLE `report_cheats` ADD COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);
ALTER TABLE `report_chronoscrolls` ADD COLUMN `id` BIGINT(20) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`id`);

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

-- launcher V2
CREATE TABLE IF NOT EXISTS `launcher_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `active` tinyint(4) NOT NULL DEFAULT '1',
  `priority` int(11) NOT NULL DEFAULT '0',
  `image` varchar(2048) DEFAULT NULL,
  `link` varchar(4096) DEFAULT NULL,
  `panelColor` varchar(64) DEFAULT NULL,
  `panelIcon` varchar(64) DEFAULT NULL,
  `displayDateStart` timestamp NULL DEFAULT NULL,
  `displayDateEnd` timestamp NULL DEFAULT NULL,
  `timerStart` timestamp NULL DEFAULT NULL,
  `timerEnd` timestamp NULL DEFAULT NULL,
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
