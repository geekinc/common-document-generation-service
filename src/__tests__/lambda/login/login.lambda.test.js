import { main } from '../../../lambda/login/login-jwt.js';
const { Event, Context } = require('../../../lib/serverless-lib.js');
process.env.LOG_LEVEL = 'off';

// Mock console methods for testing
// (this lets us throw an exception and use console.error to capture the error message)
jest.spyOn(console, "error").mockImplementation((message) => { return message; });

/**
 * Happy Path - Test the authorization method with a known user
 */
test('login - known good user', async () => {
    let event = new Event();
    let context = new Context();

    // use a known good user
    event.body = JSON.stringify({
        username: 'foo',
        password: '123'
    });

    // Call our method
    let result = await main(event, context);

    // Check the response
    const body = JSON.parse(result.body);
    expect(body).toHaveProperty('role');
    expect(body.role).toBe('ADMIN');
    expect(body).toHaveProperty('token');
});

/**
 * Broken Path - Use a known bad password
 */
test('login - known bad password', async () => {
    let event = new Event();
    let context = new Context();

    // use a known good user
    event.body = JSON.stringify({
        username: 'foo',
        password: 'WRONG_PASSWORD'
    });

    // Call our method
    let result = await main(event, context);

    // Check the response
    const body = JSON.parse(result.body);
    expect(body).toMatchObject({ error: 'Invalid credentials' });
});


/**
 * Broken Path - garbage user input
 */
test('login - garbage user input', async () => {
    let event = new Event();
    let context = new Context();

    // use a known good user
    event.body = JSON.stringify({
        username: { GARBAGE: 'DATA'},
        password: '123'
    });

    // Call our method
    let result = await main(event, context);

    // Check the response
    const body = JSON.parse(result.body);
    expect(body).toMatchObject({ error: 'Invalid credentials' });
});


/**
 * Broken Path - garbage password input
 */
test('login - garbage password input', async () => {
    let event = new Event();
    let context = new Context();

    // use a known good user
    event.body = JSON.stringify({
        username: 'foo',
        password: { GARBAGE: 'DATA'}
    });

    // Call our method
    try {
        await main(event, context);
    } catch (e) {
        expect(e).toBeDefined();
    }
});


/**
 * Broken Path - user who has been disabled
 */
test('auth - invalid user', async () => {
    let event = new Event();
    let context = new Context();

    // use a known good user
    event.body = JSON.stringify({
        username: 'bat',
        password: '123'
    });

    // Call our method
    let result = await main(event, context);

    // Check the response
    const body = JSON.parse(result.body);
    expect(body).toMatchObject({ error: 'User has been disabled' });
});
