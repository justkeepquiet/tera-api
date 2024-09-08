
ALTER TABLE `account_info` DROP PRIMARY KEY, ADD PRIMARY KEY (`accountDBID`) USING BTREE, ADD UNIQUE INDEX `userName` (`userName`), ADD UNIQUE INDEX `email` (`email`) ;
ALTER TABLE `account_info` DROP INDEX `authKey`, ADD UNIQUE INDEX `authKey` (`authKey`) USING BTREE;

CREATE TABLE IF NOT EXISTS `account_reset_password` (
  `token` VARCHAR(128) NOT NULL,
  `email` VARCHAR(64) NOT NULL,
  `code` VARCHAR(6) NULL,
  `failsCount` INT(11) NOT NULL DEFAULT '0',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`, `email`),
  INDEX `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_verify` (
  `token` VARCHAR(128) NOT NULL,
  `email` VARCHAR(64) NOT NULL,
  `code` VARCHAR(6) NULL,
  `failsCount` INT(11) NOT NULL DEFAULT '0',
  `userName` VARCHAR(64) NULL,
  `passWord` VARCHAR(128) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token`, `email`),
  INDEX `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
