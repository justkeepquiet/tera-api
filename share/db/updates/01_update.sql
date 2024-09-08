
ALTER TABLE `account_info` CHANGE COLUMN `language` `language` VARCHAR(5) NULL DEFAULT NULL COLLATE 'utf8_general_ci' AFTER `privilege`;
