
ALTER TABLE `account_benefits` CHANGE COLUMN `availableUntil` `availableUntil` DATETIME NOT NULL AFTER `benefitId`;
ALTER TABLE `account_benefits` ADD INDEX `availableUntil` (`availableUntil`);

ALTER TABLE `account_characters` ADD INDEX `name` (`name`);

ALTER TABLE `account_info` ADD COLUMN `language` VARCHAR(3) NULL DEFAULT NULL AFTER `privilege`;
ALTER TABLE `account_info` ADD INDEX `authKey` (`authKey`);
ALTER TABLE `account_info` ADD INDEX `passWord` (`passWord`);

ALTER TABLE `report_activity` ADD INDEX `serverId` (`serverId`);
ALTER TABLE `report_activity` ADD INDEX `reportTime` (`reportTime`);
ALTER TABLE `report_activity` ADD INDEX `reportType` (`reportType`);

ALTER TABLE `report_cheats` ADD INDEX `serverId` (`serverId`);
ALTER TABLE `report_cheats` ADD INDEX `reportTime` (`reportTime`);

ALTER TABLE `report_chronoscrolls` ADD INDEX `serverId` (`serverId`);
ALTER TABLE `report_chronoscrolls` ADD INDEX `reportTime` (`reportTime`);

ALTER TABLE `server_info` ADD COLUMN `permission` INT(11) NULL DEFAULT '0' AFTER `descrString`;

ALTER TABLE `server_maintenance` ADD INDEX `startTime` (`startTime`);
ALTER TABLE `server_maintenance` ADD INDEX `endTime` (`endTime`);
