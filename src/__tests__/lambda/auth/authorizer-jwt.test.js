import * as jose from 'jose';
process.env.LOG_LEVEL = 'off';

const {Event, Context} = require("../../../lib/serverless-lib.js");
const { handler } = require("../../../lambda/auth/authorizer-jwt.js");

let generatedToken = "created in beforeAll()";

// Generate a valid token for use with the following tests
beforeAll(async () => {
    const secret = new TextEncoder().encode(process.env.APP_SECRET);

    generatedToken = await new jose
        .SignJWT({ id: 1, username: "foo", role: "ADMIN"})
        .setExpirationTime('1d')
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);
});

test('authorizer-jwt - unauthorized (no header)', async () => {
    let event = new Event();
    let context = new Context();
    let result;

    // Call our method
    await handler(event, context, (callbackData) => { result = callbackData });

    // Check the response
    expect(result).toBe(false);
});

test('authorizer-jwt - unauthorized (empty header)', async () => {
    let event = new Event();
    let context = new Context();
    let result;

    // Set the headers
    event.authorizationToken = "";

    // Call our method
    await handler(event, context, (callbackData) => {result = callbackData });

    // Check the response
    expect(result).toBe(false);
});

test('authorizer-jwt - unauthorized (badly formatted bearer token)', async () => {
    let event = new Event();
    let context = new Context();
    let result;

    // Set the headers
    event.authorizationToken = "Bearer Bearer Bearer";

    // Call our method
    await handler(event, context, (callbackData) => {result = callbackData });

    // Check the response
    expect(result).toBe(false);
});

test('authorizer-jwt - authorized', async () => {
    let event = new Event();
    let context = new Context();
    let result;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedToken;

    // Call our method
    await handler(event, context, (callbackData) => { result = callbackData });

    // Check the response
    expect(result).toBe(null);
});

test('authorizer-jwt - authorized callbacks', async () => {
    let event = new Event();
    let context = new Context();
    let result;
    let policy;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedToken;

    // Call our method
    await handler(event, context, (callbackData, callbackPolicy) => {
        result = callbackData;
        policy = callbackPolicy
    });

    // Check the response
    expect(result).toBe(null);
    expect(policy.principalId).toBe(1);
});

test('authorizer-jwt - authorized specific resource', async () => {
    let event = new Event();
    let context = new Context();
    let result;
    let policy;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedToken;
    event.methodArn = "arn:aws:execute-api:us-east-1:123456789012:ymy8tbxw7b/*/GET/protected";  // made up ARN

    // Call our method
    await handler(event, context, (callbackData, callbackPolicy) => {
        result = callbackData;
        policy = callbackPolicy
    });

    // Check the response
    expect(result).toBe(null);
    expect(policy.principalId).toBe(1);
    expect(policy.policyDocument.Statement[0].Resource).toBe(event.methodArn);
});
