const Auth = require('../lib/auth.lib');
const { Request, Response } = require('../lib/serverless-test.lib');
const { logout, login } = require('../controllers/auth.controller');

/**
 * Test the encodeToken method with a basic response
 * This is a static test using userId=1 and APP_SECRET="secret"
 */
test('auth - encode token', async () => {
    // Call our method
    let result = Auth.encodeToken({userId: "1"});

    // Okay, a bit of fancy footwork here. We're using a static secret and userId, so we can predict the output
    // but the output will be different each time because of the timestamp. So we're just going to check that the
    // second part of the token is valid for this user and contains an expiry in the future
    let tokenParts = result.split('.');
    let tokenData = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('ascii'));
    let userId = tokenData['userId'];
    let expiry = tokenData['exp'];

    // Check the response
    expect(userId).toBe('1');
    expect(expiry).toBeGreaterThan(Math.floor(Date.now() / 1000));
});

/**
 * Test that the encodeToken result passes the verifyToken method with a valid response
 * This is a static test using userId=1 and APP_SECRET="secret"
 */
test('auth - encode and verify token', async () => {
    // Call our method
    let token = Auth.encodeToken({userId: "1"});
    let result = Auth.verifyToken(token);

    let userId = result['userId'];
    let expiry = result['exp'];

    // Set a timestamp for 6 days from now (minus a few seconds)
    let sixDaysFromNow = Math.floor(Date.now() / 1000) + 604800;
    sixDaysFromNow -= 60;  // Subtract 60 seconds to account for the time it takes to run the test

    // Check the response
    expect(userId).toBe('1');
    expect(expiry).toBeGreaterThan(Math.floor(sixDaysFromNow));
});

/**
 * Test that the middleware passes with a valid token and sets the userId in the request object
 * This is a static test using userId=123 and APP_SECRET="secret"
 */
test('auth - middleware verification', async () => {
    let request = new Request();
    let response = new Response();

    // fetch the token from the encodeToken method (this has already been tested)
    let token = Auth.encodeToken({userId: "1"});
    request.headers = { 'Authorization': `Bearer ${token}` };

    // Call our method
    await Auth.authMiddleware(request, response, () => { return true });

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(request.userId).toEqual("1");
});

/**
 * Test that the middleware passes with a valid token but passed in without the Bearer prefix
 * This is a static test using userId=123 and APP_SECRET="secret"
 */
test('auth - middleware verification token with no Bearer', async () => {
    let request = new Request();
    let response = new Response();

    // fetch the token from the encodeToken method (this has already been tested)
    let token = Auth.encodeToken({userId: "1"});
    request.headers = { 'Authorization': `${token}` };

    // Call our method
    await Auth.authMiddleware(request, response, () => { return true });

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(request.userId).toEqual("1");
});

/**
 * Test that the middleware fails with an invalid user
 * This is a static test using userId=123 and APP_SECRET="secret"
 */
test('auth - middleware invalid userId', async () => {
    let request = new Request();
    let response = new Response();

    // fetch the token from the encodeToken method (this has already been tested)
    let token = Auth.encodeToken({userId: "123"});
    request.headers = { 'Authorization': `Bearer ${token}` };

    // Call our method
    await Auth.authMiddleware(request, response, () => { return true });

    // Check the response
    expect(request.userId).toEqual("");
});

/**
 * Test that the middleware fails with a missing token
 * This is a static test using userId=123 and APP_SECRET="secret"
 */
test('auth - middleware missing token', async () => {
    let request = new Request();
    let response = new Response();

    // Normally, we'd create a token, but we're not going to do that here

    // Call our method
    await Auth.authMiddleware(request, response, () => { return true });

    // Check the response
    expect(request.userId).toEqual("");
});

/**
 * Test that authentication works for a signed-in user
 * This is a static test using userId=1 and APP_SECRET="secret"
 */
test('auth - valid authentication', async () => {
    let request = new Request();
    let response = new Response();

    // fetch the token from the encodeToken method (this has already been tested)
    let token = Auth.encodeToken({userId: "1"});
    request.headers = { 'Authorization': `Bearer ${token}` };

    // Authenticate the user
    await Auth.authMiddleware(request, response, () => { return true });

    // Call our method
    await Auth.authenticated(request, response, () => { return true });

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(request.userId).toEqual("1");
});

/**
 * Test that authentication fails for an invalid user
 * This is a static test using userId=1 and APP_SECRET="secret"
 */
test('auth - invalid authentication', async () => {
    let request = new Request();
    let response = new Response();

    // fetch the token from the encodeToken method (this has already been tested)
    let token = Auth.encodeToken({userId: "11111111111111"});
    request.headers = { 'Authorization': `Bearer ${token}` };

    // Authenticate the user
    await Auth.authMiddleware(request, response, () => { return true });

    // Call our method
    await Auth.authenticated(request, response, () => { return true });

    // Check the response
    expect(response.statusCode).toBe(401);
    expect(request.userId).toEqual("");
});

/**
 * Test that authentication fails for an invalid token
 * This is a static test using userId=1 and APP_SECRET="secret"
 */
test('auth - invalid token', async () => {
    let request = new Request();
    let response = new Response();

    // fetch the token from the encodeToken method (this has already been tested)
    let token = Auth.encodeToken({userId: "1"});
    token += "invalid"; // Add some garbage to the end of the token
    request.headers = { 'Authorization': `Bearer ${token}` };

    // Authenticate the user
    await Auth.authMiddleware(request, response, () => { return true });

    // Call our method
    await Auth.authenticated(request, response, () => { return true });

    // Check the response
    expect(response.statusCode).toBe(401);
    expect(request.userId).toEqual("");
});

/**
 * Test returned invalid credentials are, in fact, invalid
 */
test('auth - invalid credentials', () => {
    let response = new Response();

    // Call our method
    Auth.returnInvalidCredentials(response);

    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(401);
    expect(data.error).toEqual('Invalid username or password');
});


/**
 * Test that the request object is cleared once the user logs out
 */
test('auth - logout',  () => {
    let request = new Request();
    let response = new Response();

    // Call our method
    logout(request, response);

    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(data.error).toEqual('');
    expect(data.id).toEqual(0);
});


/**
 * Test that the user can login with valid credentials
 */
test('auth - login',  async () => {
    let request = new Request();
    let response = new Response();

    // Set the user credentials
    request.body = { username: 'foo', password: '123' };

    // Call our method
    await login(request, response);

    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(data.id).toEqual(1);
    expect(data.username).toEqual('foo');
});

/**
 * Test that the user cannot login with an invalid username
 */
test('auth - login invalid username',  async () => {
    let request = new Request();
    let response = new Response();

    // Set the user credentials (invalid)
    request.body = { username: 'armpit', password: '123' };

    // Call our method
    await login(request, response);

    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(401);
    expect(data.id).toEqual(0);
    expect(data.username).toEqual('');
});


/**
 * Test that the user cannot login with an invalid password
 */
test('auth - login invalid password',  async () => {
    let request = new Request();
    let response = new Response();

    // Set the user credentials (invalid)
    request.body = { username: 'foo', password: '1234567890' };

    // Call our method
    await login(request, response);

    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(401);
    expect(data.id).toEqual(0);
    expect(data.username).toEqual('');
});

/**
 *  Test fetching the userId from the token
 */
test('auth - get userId from token',  async () => {
    let request = new Request();
    let response = new Response();

    // Set the user credentials
    request.body = { username: 'foo', password: '123' };

    // Call our method
    await login(request, response);

    let data = JSON.parse(response.data);

    // Call our method
    let userId = Auth.getUserIdFromToken(data.token);

    // Check the response
    expect(userId).toEqual(1);
    expect(response.statusCode).toBe(200);
    expect(data.id).toEqual(1);
    expect(data.username).toEqual('foo');
});

/**
 *  Test fetching the role from the token
 */
test('auth - get role from token',  async () => {
    let request = new Request();
    let response = new Response();

    // Set the user credentials
    request.body = { username: 'foo', password: '123' };

    // Call our method
    await login(request, response);

    let data = JSON.parse(response.data);

    // Call our method
    let role = Auth.getUserRoleFromToken(data.token);

    // Check the response
    expect(role).toEqual('ADMIN');
});

// /**
//  *  Test fetching the user from the token (if the user exists)
//  */
// test('auth - get user from token', async () => {
//     let request = new Request();
//     let response = new Response();
//
//     // Set the user credentials
//     request.body = { username: 'foo', password: '123' };
//
//     // Call our method
//     await login(request, response);
//
//     let data = JSON.parse(response.data);
//
//     // Call our method
//     let user = await getUserFromToken(data.token);
//
//     // Check the response
//     expect(user.id).toEqual(1);
//     expect(user.username).toEqual('foo');
//     expect(user.role).toEqual('ADMIN');
//     expect(response.statusCode).toBe(200);
//     expect(data.id).toEqual(1);
//     expect(data.username).toEqual('foo');
// });
