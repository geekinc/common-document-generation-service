const { Event, Context } = require('../../lib/serverless-lib.js');
const { armpit } = require('../../lambda/armpit/armpit.js');
const { armpitCount } = require('../../lambda/armpit/armpit-count.js');

/**
 * Test the armpit method with a basic response
 */
test('armpit - basic response', async () => {
    let event = new Event();
    let context = new Context();

    // Call our method
    let result = await armpit(event, context);

    // Check the response
    expect(result.body).toBe('oxter');
});

/**
 * Test the armpitCount method with a basic response
 * The parameters can only be positive integers - this sends in a positive integer
 */
test('armpitCount - basic response', async () => {
    let event = new Event();
    let context = new Context();

    // Set specific parameters for the request
    event.pathParameters = { count: '3' };

    // Call our method
    let result = await armpitCount(event, context);

    // Check the response
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(event.pathParameters.count);
});

/**
 * Test the armpitCount method with a failing response
 * The parameters can only be positive integers - this sends in a negative integer
 */
test('armpitCount - failing response - parameter error', async () => {
    let event = new Event();
    let context = new Context();

    // Set specific parameters for the request
    event.pathParameters = { count: '-50' };

    // Call our method
    let result = await armpitCount(event, context);

    // Check the response
    expect(result.statusCode).toBe(400);
    expect(result.body).toBe('Count must be a positive integer');
});

/**
 * Test the armpitCount method with a failing response
 * ArmpitCount expects a parameter called count, but we're sending in a parameter called counter
 * This triggers a parameter error serverside
 */
test('armpitCount - failing response - server error', async () => {
    let event = new Event();
    let context = new Context();

    // Intentionally misspell the parameter
    event.pathParameters = { counter: '666' };      // Should be count, not counter for a proper request

    // Call our method
    let result = await armpitCount(event, context);

    // Check the response
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Missing count parameter');
});

