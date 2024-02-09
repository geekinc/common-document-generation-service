-- Create and initialize the database

-- -----------------------------------------------------
CREATE DATABASE
    IF NOT EXISTS `cdgs`
    DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `cdgs`;
-- -----------------------------------------------------

CREATE TABLE
    IF NOT EXISTS `user`
(
    id           INT NOT NULL AUTO_INCREMENT,
    username     VARCHAR(100),
    password     VARCHAR(100),
    role         VARCHAR(100) default 'USER',
    firstname    VARCHAR(100),
    lastname     VARCHAR(100),
    enabled      BOOLEAN default true,

    PRIMARY KEY (`id`)
);


CREATE TABLE
    IF NOT EXISTS `user_metadata`
(
    id           INT NOT NULL AUTO_INCREMENT,
    user_id      INT,
    username     VARCHAR(100),
    password     VARCHAR(100),
    role         VARCHAR(100) default 'USER',
    firstname    VARCHAR(100),
    lastname     VARCHAR(100),
    enabled      BOOLEAN default true,

    PRIMARY KEY (`id`)
);


CREATE TABLE
    IF NOT EXISTS `template`
(
   id                   INT auto_increment NOT NULL,
   carbone_id           varchar(100) NULL,
   filename             varchar(100) NULL,
   filetype             varchar(100) NULL,
   storage_location     varchar(255) NULL,
   private_status       tinyint(1) DEFAULT 0,
   strict               tinyint(1) DEFAULT 0,
   created_by           varchar(100) NULL,
   created_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

   PRIMARY KEY (id)
);


CREATE TABLE
    IF NOT EXISTS `log`
(
   id                   INT auto_increment NOT NULL,
   log_level            varchar(100) NULL,
   message              MEDIUMTEXT NULL,
   created_timestamp    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

   PRIMARY KEY (id)
);

