import Users from '../../lib/user-lib.js';
import * as jose from "jose";

let output = '';

// Mock console methods for testing
jest.spyOn(console, "error").mockImplementation((message) => { output = message; });

/**
 * Happy path test - find a user we know exists
 *
 **/
test('user-lib - get a user', async () => {
    let result = await Users.getUserByUsername('foo');

    // Check the response for the expected error
    expect(result[0].role).toBe('ADMIN');
});

/**
 * Error path test - pass an object into the function to cause an exception to be thrown
 *
 **/
test('user-lib - get a non-existent user', async () => {
    const invalidData = Object.create({armpit: "oxter"});

    try {
        await Users.getUserByUsername(invalidData);
    } catch (e) {
        expect(e.message).toBe('Error getting user');
    }

    // Check the response for the expected error
    expect(output.code).toBe("ER_BAD_FIELD_ERROR");
});

/**
 * Happy path test - find a user we know exists by id
 *
 **/
test('user-lib - get a user by id', async () => {
    let result = await Users.getUserById(1);

    // Check the response for the expected error
    expect(result[0].role).toBe('ADMIN');
});

/**
 * Happy path test - get all users
 *
 **/
test('user-lib - get all users', async () => {
    let result = await Users.getAllUsers()

    // Check the response for the expected error
    expect(result.length).toBeGreaterThan(1);
});

/**
 * Happy path test - get all users count
 *
 **/
test('user-lib - get all users', async () => {
    let result = await Users.getAllUsersCount()

    // Check the response for the expected error
    expect(result[0].usersCount).toBeGreaterThan(1);
});

/**
 * Breaking test - create a user missing username
 *
 **/
test('user-lib - create a user missing username', async () => {
    try {
        await Users.createUser(null, 'password');
    } catch (e) {
        expect(e.message).toBe('Missing parameters');
    }
});

/**
 * Breaking test - create a user missing password
 *
 **/
test('user-lib - create a user missing password', async () => {
    try {
        await Users.createUser('username', null);
    } catch (e) {
        expect(e.message).toBe('Missing parameters');
    }
});

/**
 * Happy path - create a user
 *
 **/
test('user-lib - create a user', async () => {
    let result = await Users.createUser('new_user_1', 'testPassW0rd!!');

    expect(result.affectedRows).toBe(1);

    // clean up
    const userId = result.insertId;
    await Users.deleteUser(userId);
});

/**
 * Happy path - delete a user
 *
 **/
test('user-lib - delete a user', async () => {
    let result = await Users.createUser('new_user_2', 'testPassW0rd!!');

    const userId = result.insertId;
    result = await Users.deleteUser(userId);

    // clean up
    expect(result.affectedRows).toBe(1);
});

/**
 * Happy path - update a user
 *
 **/
test('user-lib - update a user', async () => {
    let result = await Users.createUser('new_user_3', 'testPassW0rd!!');

    const userId = result.insertId;
    result = await Users.updateUser(userId, {username: 'new_user_armpit'});
    result = await Users.updateUser(userId, {password: 'aDIFFERENTpassW0rd!!'});
    result = await Users.updateUser(userId, {firstname: 'test'});
    result = await Users.updateUser(userId, {lastname: 'McTesterson'});

    expect(result[0].username).toBe('new_user_armpit');

    // clean up
    await Users.deleteUser(userId);
});

/**
 * Breaking path - update a user with a wrong id
 *
 **/
test('user-lib - update a user with a wrong id', async () => {
    try {
        await Users.updateUser(0, {username: 'new_user_armpit'});
    } catch (e) {
        expect(e.message).toBe('Missing id parameter');
    }
});

/**
 * Happy path - create a user and update their role
 *
 **/
test('user-lib - update a user role', async () => {
    let result = await Users.createUser('new_user_3', 'testPassW0rd!!');
    const userId = result.insertId;

    // Generate an admin JWT
    const secret = new TextEncoder().encode(process.env.APP_SECRET);

    let token = await new jose
        .SignJWT({
            role: 'ADMIN',
            userId: 1
        })
        .setExpirationTime('30d')
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

    result = await Users.setUserRole(userId, 'ADMIN', token);

    // Confirm that a change was made
    expect(result.affectedRows).toBe(1);

    // lookup user
    result = await Users.getUserById(userId);
    expect(result[0].username).toBe('new_user_3');
    expect(result[0].role).toBe('ADMIN');

    // clean up
    await Users.deleteUser(userId);
});


/**
 * Breaking path - create a user and update their role (wrong permissions)
 *
 **/
test('user-lib - update a user role (wrong permissions)', async () => {
    let result = await Users.createUser('new_user_4', 'testPassW0rd!!');
    const userId = result.insertId;

    // Generate an admin JWT
    const secret = new TextEncoder().encode(process.env.APP_SECRET);

    let token = await new jose
        .SignJWT({
            role: 'USER',       // This should fail because the user is not an admin
            userId: 1
        })
        .setExpirationTime('30d')
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

    // Catch the exception that gets thrown when the user tries to update the role
    try {
        await Users.setUserRole(userId, 'ADMIN', token);
    } catch (e) {
        expect(e.message).toBe('Unauthorized');
    }

    // lookup user
    result = await Users.getUserById(userId);
    expect(result[0].username).toBe('new_user_4');
    expect(result[0].role).toBe('USER');

    // clean up
    await Users.deleteUser(userId);
});

/**
 * Breaking path - create a user and update their role (garbage token)
 *
 **/
test('user-lib - update a user role (wrong permissions)', async () => {
    let result = await Users.createUser('new_user_4', 'testPassW0rd!!');
    const userId = result.insertId;

    // Generate an admin JWT
    const secret = new TextEncoder().encode(process.env.APP_SECRET);

    let token = await new jose
        .SignJWT({
            role: null,       // This should fail because the user is not an admin
            userId: null
        })
        .setExpirationTime('30d')
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

    // Catch the exception that gets thrown when the user tries to update the role
    try {
        await Users.setUserRole(userId, 'ADMIN', token);
    } catch (e) {
        expect(e.message).toBe('Unauthorized');
    }

    // lookup user
    result = await Users.getUserById(userId);
    expect(result[0].username).toBe('new_user_4');
    expect(result[0].role).toBe('USER');

    // clean up
    await Users.deleteUser(userId);
});
