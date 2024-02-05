-- Create and initialize the database

-- -----------------------------------------------------
CREATE DATABASE
    IF NOT EXISTS `dynamic`
    DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `dynamic`;
-- -----------------------------------------------------

-- Table `dynamic`.`user`
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


-- Table `dynamic`.`user_metadata`
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
