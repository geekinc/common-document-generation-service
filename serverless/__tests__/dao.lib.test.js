const dao = require('../lib/dao.lib');

/**
 *   Test the get method by executing a simple select query
 */
test('dao - get user', async () => {
    let username = 'foo';

    // Call our method
    let user = await dao.get("SELECT * FROM users WHERE username = ?", [username]);

    // Check the response
    expect(user.id).toBe(1);
});

/**
 *   Test the get method by executing a BROKEN select query
 */
test('dao - get user pass garbage', async () => {
    let username = 'foo';
    let user;
    let thrownValue;

    // Call our method
    try {
        user = await dao.get("SELECT * FROM users WHERE username_WRONG_FIELD = ?", [username]);
    } catch (error) {
        thrownValue = error;
    }

    // Check the response
    expect(user).toBe(undefined);
    expect(thrownValue).toBe('SQLITE_ERROR: no such column: username_WRONG_FIELD');
});

/**
 *   Test the run method by executing a simple insert query
 */
test('dao - run insert', async () => {
    let username = 'chuck';
    let password = 'norris';

    // Call our method
    await dao.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
    let user = await dao.get("SELECT * FROM users WHERE username = ?", [username]);

    // Check the response
    expect(user.username).toBe(username);
});

/**
 *   Test the run method by executing a BROKEN insert query
 */
test('dao - run insert broken query', async () => {
    let username = 'chuck';
    let password = 'norris';
    let thrownValue;

    // Call our method
    try {
        await dao.run("INSERT INTO users (username_WRONG_FIELD, password) VALUES (?, ?)", [username, password]);
    } catch (error) {
        thrownValue = error;
    }

    // Check the response
    expect(thrownValue).toBe('SQLITE_ERROR: table users has no column named username_WRONG_FIELD');
});

/**
 *   Test the run method by executing a delete query
 */
test('dao - run delete', async () => {
    let username = 'chuck';

    // Call our method
    await dao.run("DELETE FROM users WHERE username = ?", [username]);
    let user = await dao.get("SELECT * FROM users WHERE username = ?", [username]);

    // Check the response
    expect(user).toBe(undefined);
});

/**
 *   Test the all method by executing a simple select query
 */
test('dao - run all', async () => {
    // Call our method
    let users = await dao.all("SELECT * FROM users", []);

    expect(users.length).toBeGreaterThanOrEqual(1);

});

/**
 *   Test the all method by executing a BROKEN select query
 */
test('dao - run all - invalid SQL', async () => {
    let users;
    let thrownValue;

    // Call our method
    try {
        users = await dao.all("SELECT * FROM users_TABLE_DOES_NOT_EXIST", []);
    } catch (error) {
        thrownValue = error;
    }

    expect(users).toBe(undefined);
    expect(thrownValue).toBe('SQLITE_ERROR: no such table: users_TABLE_DOES_NOT_EXIST');

});
