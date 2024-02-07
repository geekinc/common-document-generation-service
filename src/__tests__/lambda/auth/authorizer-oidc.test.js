import * as jose from 'jose';
import { authenticate } from "../../../lib/keycloak-lib.js";
process.env.LOG_LEVEL = 'off';

const { Event, Context } = require("../../../lib/serverless-lib.js");
const { handler } = require("../../../lambda/auth/authorizer-oidc.js");


let generatedToken = "created in beforeAll()";

// Generate a valid token for use with the following tests
beforeAll(async () => {
    let result = await authenticate('foo', '456');
    generatedToken = result.data.access_token;
});

test('authorizer-oidc - unauthorized (no header)', async () => {
    let event = new Event();
    let context = new Context();
    let result;

    // Call our method
    await handler(event, context, (callbackData) => { result = callbackData });

    // Check the response
    expect(result).toBe(false);
});

test('authorizer-oidc - unauthorized (empty header)', async () => {
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

test('authorizer-oidc - unauthorized (badly formatted bearer token)', async () => {
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

test('authorizer-oidc - authorized', async () => {
    let event = new Event();
    let context = new Context();
    let result, policy;

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

test('authorizer-oidc - authorized callbacks', async () => {
    let event = new Event();
    let context = new Context();
    let result, policy;

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

test('authorizer-oidc - authorized specific resource', async () => {
    let event = new Event();
    let context = new Context();
    let result, policy;

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
