const { Request, Response } = require('../lib/serverless-test.lib');
const { apolloSearch } = require('../controllers/apollo.controller');

/**
 * Test the apolloSearch method with a basic response
 */
test('apollo - basic response', async () => {
    let request = new Request();
    let response = new Response();

    // Put the parameters as JSON in the body
    request.body = `{ 
        "email": "ben@geekinc.ca", 
        "password": "%26p7%2AMdQZ%25-w%2B%2Bu%21" 
    }`;

    // Call our method
    await apolloSearch(request, response);

    // Check the response
    expect(response.statusCode).toBe(200);
    expect(response.data['is_logged_in']).toBe(true);
});

/**
 * Test the apolloSearch method with invalid JSON
 * The body must contain valid JSON, either as a string or an object
 */
test('apollo - bad JSON', async () => {
    let request = new Request();
    let response = new Response();

    // Put the parameters as JSON in the body
    // This is a badly formatted JSON string - no quotes around the value and invalid parameter
    request.body = `{ "armpit": oxter }`;

    // Call our method
    await apolloSearch(request, response);

    // Parse the response (apollo returns JSON)
    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(400);
    expect(data['message']).toBe('Invalid request body');
    expect(data['is_logged_in']).toBe(false);
});

/**
 * Test the apolloSearch method with an array
 * The body must contain valid JSON, either as a string or an object
 */
test('apollo - pass in array', async () => {
    let request = new Request();
    let response = new Response();

    // Put the parameters as JSON in the body
    // The method expects an object or string, not an array
    request.body = ['armpit', 'oxter'];

    // Call our method
    await apolloSearch(request, response);

    // Parse the response (apollo returns JSON)
    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(400);
    expect(data['message']).toBe('Missing required parameter');
    expect(data['is_logged_in']).toBe(false);
});

/**
 * Test the apolloSearch method with a string
 * The body must contain valid JSON, and that JSON must contain the required parameters
 */
test('apollo - missing parameter', async () => {
    let request = new Request();
    let response = new Response();

    // Put the parameters as JSON in the body
    // This is missing the password parameter
    request.body = `{ "email": "me@here.com" }`;

    // Call our method
    await apolloSearch(request, response);

    // Parse the response (apollo returns JSON)
    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(400);
    expect(data['message']).toBe('Missing required parameter');
    expect(data['is_logged_in']).toBe(false);
});

/**
 * Test the apolloSearch method with a string
 * The body must contain valid JSON, and that JSON must contain the required parameters
 * The user and password must be valid
 */
test('apollo - invalid user', async () => {
    let request = new Request();
    let response = new Response();

    // Put the parameters as JSON in the body
    // This is an invalid apollo user
    request.body = `{ "email": "me@here.com", "password": "123456" }`;

    // Call our method
    await apolloSearch(request, response);

    // Parse the response (apollo returns JSON)
    let data = JSON.parse(response.data);

    // Check the response
    expect(response.statusCode).toBe(500);
    expect(data['message']).toBe('There was an error processing your request');
    expect(data['is_logged_in']).toBe(false);
});
