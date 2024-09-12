
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
  `code` varchar(6) NULL,
  `failsCount` int(11) NOT NULL DEFAULT '0',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`, `email`),
  INDEX `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_verify` (
  `token` varchar(128) NOT NULL,
  `email` varchar(64) NOT NULL,
  `code` varchar(6) NULL,
  `failsCount` int(11) NOT NULL DEFAULT '0',
  `userName` varchar(64) NULL,
  `passWord` varchar(128) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`, `email`),
  INDEX `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
