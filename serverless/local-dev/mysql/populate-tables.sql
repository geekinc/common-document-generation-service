USE `dynamic`;

-- Delete the current data to start fresh
TRUNCATE TABLE `user`;

-- Insert a test admin user
INSERT INTO `user`
(`username`, `password`, `role`, `firstname`, `lastname`, `enabled`)
VALUES ('foo', '$2b$10$BzXfGmp0.zXyPB5JGGxfouCq8zTx1R.fmPs/tI1ODvkqvI8nwmDBS', 'ADMIN', 'Administrator', 'De Admin', true);

-- Insert a test user
INSERT INTO `user`
(`username`, `password`, `role`, `firstname`, `lastname`, `enabled`)
VALUES ('bar', '$2b$10$BzXfGmp0.zXyPB5JGGxfouCq8zTx1R.fmPs/tI1ODvkqvI8nwmDBS', 'USER', 'User', 'McUserson', true);

-- Insert a test user who is NOT enabled
INSERT INTO `user`
(`username`, `password`, `role`, `firstname`, `lastname`, `enabled`)
VALUES ('bat', '$2b$10$BzXfGmp0.zXyPB5JGGxfouCq8zTx1R.fmPs/tI1ODvkqvI8nwmDBS', 'USER', 'User', 'McUserson', false);

