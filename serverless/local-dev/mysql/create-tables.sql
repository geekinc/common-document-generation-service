-- Create and initialize the database

-- -----------------------------------------------------
CREATE DATABASE
    IF NOT EXISTS `dynamic`
    DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `dynamic`;
-- -----------------------------------------------------

-- Table `dynamic`.`users`
CREATE TABLE
    IF NOT EXISTS `users`
(
    id           INT NOT NULL AUTO_INCREMENT,
    username     VARCHAR(100),
    password     VARCHAR(100),
    role         VARCHAR(100) default 'USER',
    firstname    VARCHAR(100),
    lastname    VARCHAR(100),
    PRIMARY KEY (`id`)
);

-- Delete the current data to start fresh
TRUNCATE TABLE `users`;

-- Insert a test admin user
INSERT INTO `users`
    (`username`, `password`, `role`, `firstname`, `lastname`)
VALUES ('foo', '$2b$10$BzXfGmp0.zXyPB5JGGxfouCq8zTx1R.fmPs/tI1ODvkqvI8nwmDBS', 'ADMIN', 'Administrator', 'De Admin');

-- Insert a test user
INSERT INTO `users`
(`username`, `password`, `role`, `firstname`, `lastname`)
VALUES ('bar', '$2b$10$BzXfGmp0.zXyPB5JGGxfouCq8zTx1R.fmPs/tI1ODvkqvI8nwmDBS', 'USER', 'User', 'McUserson');
