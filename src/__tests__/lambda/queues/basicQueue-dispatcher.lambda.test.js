import {Context, Event} from "../../../lib/serverless-lib.js";
const { handler } = require('../../../lambda/queues/basicQueue-dispatcher.js');

/**
 * Set up the mock to catch the SQS call
 */
jest.mock('aws-sdk', () => {
    const SQSMocked = {
        sendMessage: jest.fn().mockReturnThis(),
        promise: jest.fn()
    };
    return {
        SQS: jest.fn(() => SQSMocked)
    };
});

/**
 * This tests the "happy path" functionality
 */
test('basicQueue dispatcher - send a properly formatted message', async () => {
    let event = new Event();
    let context = new Context();

    // Set the JSON body
    event.body = JSON.stringify(
        {
            "destination": "basicQueue",
            "payload": {
                "haa": "boo"
            }
        }
    );

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(200);
});

/**
 * Test for when the JSON does not pass the JOI validator
 */
test('basicQueue dispatcher - send a badly formatted JSON message', async () => {
    let event = new Event();
    let context = new Context();

    // Set the JSON body
    event.body = JSON.stringify(
        {
            "destination": "ARMPIT",
            "payload": {
                "haa": "boo"
            }
        }
    );

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(500);
});

/**
 * Test for when we don't even pass JSON in
 */
test('basicQueue dispatcher - send a badly formatted garbage message', async () => {
    let event = new Event();
    let context = new Context();

    // Set the JSON body
    event.body = "garbage";

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(500);
});
