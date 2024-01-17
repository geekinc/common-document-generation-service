const Users = require('../lib/user.lib');
const Auth = require('../lib/auth.lib');
const { login } = require('../controllers/auth.controller');
const { Request, Response } = require("../lib/serverless-test.lib");

/**
 *   Create new user given a username and password
 *   Look that user up by username
 *   Delete the user by id
 */
test('user.lib - create user', async () => {
    let username = 'armpit';
    let password = 'oxter';
    let user;

    // Call our method (create, lookup)
    try {
        await Users.createUser(username, password);
        user = await Users.getUserByUsername(username);
    } catch (error) {
        console.log(error.message);
    }

    // Check the response
    expect(user.username).toBe(username);

    // Call our method (delete)
    try {
        await Users.deleteUser(user.id);
        user = await Users.getUserByUsername(username);
    } catch (error) {
        console.log(error.message);
    }

    // Check the response
    expect(user).toBe(undefined);
});

/**
 *   Test an exception by only passing a username (blank password)
 */
test('user.lib - create user - missing parameters', async () => {
    let username = 'armpit';
    let user;
    let thrownValue;

    // Call our method (create, lookup)
    try {
        await Users.createUser(username, '');
        user = await Users.getUserByUsername(username);
    } catch (error) {
        thrownValue = error;
    }

    // Check the response
    expect(user).toBe(undefined);
    expect(thrownValue.message).toBe('Missing parameters');
});

/**
 *   Test the get method by searching for a known user
 */
test('user.lib - get user', async () => {
    let username = 'foo';

    // Call our method
    let user = await Users.getUserByUsername(username);

    // Check the response
    expect(user.id).toBe(1);
});

/**
 *   Test the get method by searching for a known user
 *   Test the update method by updating the user's password
 */
test('user.lib - update user', async () => {
    let request = new Request();
    let response = new Response();
    let username = 'armpit2';
    let password = 'oxter2';
    let user;

    // Call our method (create, lookup)
    await Users.createUser(username, password);
    user = await Users.getUserByUsername(username);

    // Check the response
    expect(user.username).toBe(username);

    // Call our method (update)
    await Users.updateUser(user.id, username, 'oxter3');
    user = await Users.getUserByUsername(username);

    // fetch the token from the encodeToken method (this has already been tested)
    let token = Auth.encodeToken(
        {
            userId: user.id,
            role: user.role
        }
    );
    request.headers = { 'Authorization': `Bearer ${token}` };

    // Authenticate the user
    await Auth.authMiddleware(request, response, () => { return true });

    await Auth.authenticated(request, response, () => { return true });

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(request.userId).toEqual(user.id);

    // Call our method (delete)
    await Users.deleteUser(user.id);
    user = await Users.getUserById(user.id);

    // Check the response
    expect(user).toBe(undefined);
});


/**
 *   Test the get method by searching for a known user
 *   Test the update method exceptions by updating without valid data
 */
test('user.lib - update user broken query', async () => {
    let username = 'armpit123';
    let password = 'oxter456';
    let user;
    let thrownValue;
    let userId;

    // Call our method (create, lookup)
    await Users.createUser(username, password);
    user = await Users.getUserByUsername(username);

    // Check the response
    expect(user.username).toBe(username);
    userId = user.id;

    try {
        // Call our method (update)
        await Users.updateUser(user.id, username, null);
        user = await Users.getUserByUsername(username);
    } catch (error) {
        thrownValue = error;
    }

    // Check the response
    expect(thrownValue.message).toBe('Missing parameters');

    // Call our method (delete)
    await Users.deleteUser(userId);
    user = await Users.getUserById(userId);

    // Check the response
    expect(user).toBe(undefined);
});

/**
 *   Test the get method by searching for a known user
 *   Test the update role method by updating the user's role
 */
test('user.lib - update user role', async () => {
    let username = 'armpit123';
    let password = 'oxter456';
    let user;
    let thrownValue;
    let userId;

    // Call our method (create, lookup)
    await Users.createUser(username, password);
    user = await Users.getUserByUsername(username);

    // Check the response
    expect(user.username).toBe(username);
    userId = user.id;

    try {
        // Login as a known admin to get the token
        let request = new Request();
        let response = new Response();

        // Set the user credentials
        request.body = { username: 'foo', password: '123' };

        // Call our method
        let admin = await login(request, response);
        let adminData = JSON.parse(admin.data);

        // Call our method (update)
        await Users.setUserRole(user.id, "ADMIN", adminData['token']);
        user = await Users.getUserByUsername(username);
    } catch (error) {
        console.log(error);
        thrownValue = error;
    }

    // Check the response
    expect(user.role).toBe("ADMIN");

    // Call our method (delete)
    await Users.deleteUser(userId);
    user = await Users.getUserById(userId);

    // Check the response
    expect(user).toBe(undefined);
});

/**
 *   Test the get method by searching for a known user (but bad authentication)
 *   Test the update role method by updating the user's role
 */
test('user.lib - update user role with bad authentication', async () => {
    let username = 'armpit123';
    let password = 'oxter456';
    let user;
    let thrownValue;
    let userId;

    // Call our method (create, lookup)
    await Users.createUser(username, password);
    user = await Users.getUserByUsername(username);

    // Check the response
    expect(user.username).toBe(username);
    userId = user.id;

    try {
        // Login as a known admin to get the token
        let request = new Request();
        let response = new Response();

        // Set the user credentials (not an admin)
        request.body = { username: 'bar', password: '456' };  // -- THE PASSWORD IS INCORRECT

        // Call our method
        let admin = await login(request, response);
        let adminData = JSON.parse(admin.data);

        // Call our method (update)
        await Users.setUserRole(user.id, "ADMIN", adminData['token']);
        user = await Users.getUserByUsername(username);
    } catch (error) {
        thrownValue = error;
    }

    // Call our method (delete)
    await Users.deleteUser(userId);
    user = await Users.getUserById(userId);

    // Check the response
    expect(thrownValue.message).toBe("Jwt cannot be parsed");   // THIS IS THE ERROR WE EXPECT WITH A BAD LOGIN
    expect(user).toBe(undefined);
});

/**
 *   Test the get method by searching for a known user (but not an admin)
 *   Test the update role method by updating the user's role
 */
test('user.lib - update user role with correct authentication but wrong permissions', async () => {
    let username = 'armpit123';
    let password = 'oxter456';
    let user;
    let thrownValue;
    let userId;

    // Call our method (create, lookup)
    await Users.createUser(username, password);
    user = await Users.getUserByUsername(username);

    // Check the response
    expect(user.username).toBe(username);
    userId = user.id;

    try {
        // Login as a known admin to get the token
        let request = new Request();
        let response = new Response();

        // Set the user credentials (not an admin)
        request.body = { username: 'bar', password: '123' };

        // Call our method
        let admin = await login(request, response);
        let adminData = JSON.parse(admin.data);

        // Call our method (update)
        await Users.setUserRole(user.id, "ADMIN", adminData['token']);
        user = await Users.getUserByUsername(username);
    } catch (error) {
        thrownValue = error;
    }

    // Call our method (delete)
    await Users.deleteUser(userId);
    user = await Users.getUserById(userId);

    // Check the response
    expect(thrownValue.message).toBe("Unauthorized");   // THIS IS THE ERROR WE EXPECT WITH WRONG PERMISSIONS
    expect(user).toBe(undefined);
});

/**
 *   Test get all users
 */
test('user.lib - get all users', async () => {
    // Call our method
    let usersList = await Users.getAllUsers();

    // Check the response
    expect(usersList.length).toBeGreaterThanOrEqual(2);
});
