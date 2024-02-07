import * as jose from 'jose';
import { authenticate } from "../../../lib/keycloak-lib.js";
import { handler } from "../../../lambda/auth/authorizer-combined.js";
process.env.LOG_LEVEL = 'off';

const { Event, Context } = require("../../../lib/serverless-lib.js");


let generatedTokenOIDC = "created in beforeAll()";
let generatedTokenJWT = "created in beforeAll()";


// Generate a valid token for use with the following tests
beforeAll(async () => {
    let result = await authenticate('foo', '456');
    generatedTokenOIDC = result.data.access_token;

    const secret = new TextEncoder().encode(process.env.APP_SECRET);

    generatedTokenJWT = await new jose
        .SignJWT({ id: 1, username: "foo", role: "ADMIN"})
        .setExpirationTime('1d')
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);
});

test('authorizer-combined - unauthorized (no header)', async () => {
    let event = new Event();
    let context = new Context();
    let result;

    // Call our method
    await handler(event, context, (callbackData) => { result = callbackData });

    // Check the response
    expect(result).toBe(false);
});

test('authorizer-combined - unauthorized (empty header)', async () => {
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

test('authorizer-combined - unauthorized (badly formatted bearer token)', async () => {
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

test('authorizer-combined - OIDC authorized', async () => {
    let event = new Event();
    let context = new Context();
    let result, policy;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedTokenOIDC;

    // Call our method
    await handler(event, context, (callbackData, callbackPolicy) => {
        result = callbackData;
        policy = callbackPolicy
    });

    // Check the response
    expect(result).toBe(null);
    expect(policy.principalId).toBe(1);
});

test('authorizer-combined - OIDC authorized callbacks', async () => {
    let event = new Event();
    let context = new Context();
    let result, policy;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedTokenOIDC;

    // Call our method
    await handler(event, context, (callbackData, callbackPolicy) => {
        result = callbackData;
        policy = callbackPolicy
    });

    // Check the response
    expect(result).toBe(null);
    expect(policy.principalId).toBe(1);
});

test('authorizer-combined - OIDC authorized specific resource', async () => {
    let event = new Event();
    let context = new Context();
    let result, policy;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedTokenOIDC;
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



test('authorizer-jwt - JWT authorized', async () => {
    let event = new Event();
    let context = new Context();
    let result;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedTokenJWT;

    // Call our method
    await handler(event, context, (callbackData) => { result = callbackData });

    // Check the response
    expect(result).toBe(null);
});

test('authorizer-jwt - JWT authorized callbacks', async () => {
    let event = new Event();
    let context = new Context();
    let result;
    let policy;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedTokenJWT;

    // Call our method
    await handler(event, context, (callbackData, callbackPolicy) => {
        result = callbackData;
        policy = callbackPolicy
    });

    // Check the response
    expect(result).toBe(null);
    expect(policy.principalId).toBe(1);
});

test('authorizer-jwt - JWT authorized specific resource', async () => {
    let event = new Event();
    let context = new Context();
    let result;
    let policy;

    // Set the bearer token
    event.authorizationToken = 'Bearer ' + generatedTokenJWT;
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
