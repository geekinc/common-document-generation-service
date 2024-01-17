const { Request, Response } = require('../lib/serverless-test.lib');
const { armpit, armpitCount } = require('../controllers/armpit.controller');

/**
 * Test the armpit method with a basic response
 */
test('armpit - basic response', async () => {
    let request = new Request();
    let response = new Response();

    // Call our method
    await armpit(request, response);

    // Check the response
    expect(response.data).toBe('oxter');
});

/**
 * Test the armpitCount method with a basic response
 * The parameters can only be positive integers - this sends in a positive integer
 */
test('armpitCount - basic response', async () => {
    let request = new Request();
    let response = new Response();

    // Set specific parameters for the request
    request.params = { count: '3' };

    // Call our method
    await armpitCount(request, response);

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(response.data).toBe(request.params.count);
});

/**
 * Test the armpitCount method with a failing response
 * The parameters can only be positive integers - this sends in a negative integer
 */
test('armpitCount - failing response - parameter error', async () => {
    let request = new Request();
    let response = new Response();

    // Set specific parameters for the request
    request.params = { count: '-50' };

    // Call our method
    await armpitCount(request, response);

    // Check the response
    expect(response.statusCode).toBe(400);
    expect(response.data).toBe('Count must be a positive integer');
});

/**
 * Test the armpitCount method with a failing response
 * ArmpitCount expects a parameter called count, but we're sending in a parameter called counter
 * This triggers a parameter error serverside
 */
test('armpitCount - failing response - server error', async () => {
    let request = new Request();
    let response = new Response();

    // Intentionally misspell the parameter (should be count, not counter)
    request.params = { counter: '666' };

    // Call our method
    await armpitCount(request, response);

    // Check the response
    expect(response.statusCode).toBe(500);
    expect(response.data).toBe('There was an error processing your request');
});

