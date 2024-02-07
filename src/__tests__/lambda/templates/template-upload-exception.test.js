import {Context, Event} from "../../../lib/serverless-lib.js";
const { handler } = require('../../../lambda/templates/template-upload.js');
process.env.LOG_LEVEL = 'off';

// Mock an exception from S3 for these tests
jest.mock('aws-sdk', () => {
    const S3Mocked = {
        putObject: jest.fn().mockImplementation(() => {
            throw new Error('S3 Exception');
        }),
        promise: jest.fn()
    };
    return {
        S3: jest.fn(() => S3Mocked)
    };
});

/**
 * Broken path - error from S3
 */
test('template-upload - upload a single text based file with S3 exception', async () => {
    let event = new Event();
    let context = new Context();

    // Set the JSON body
    event.body = '----------------------------472741063475104389439235\r\n' +
        'Content-Disposition: form-data; name="file"; filename="test.txt"\r\n' +
        'Content-Type: text/plain\r\n' +
        '\r\n' +
        'This is a test of the emergency broadcast system.\r\n' +
        '\r\n' +
        'This is a test.\r\n' +
        '\r\n' +
        'This is only a test.\r\n' +
        '\r\n' +
        "Had this been a real emergency, you'd be dead.\r\n" +
        '\r\n' +
        'Have a nice day.\r\n' +
        '----------------------------472741063475104389439235--\r\n';

    event.headers = {
        Accept: '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': 'c59e1d6b-ee10-4d9f-a823-b5e14980b2e1',
        Host: 'localhost:3500',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Content-Type': 'multipart/form-data; boundary=--------------------------472741063475104389439235',
        'Content-Length': '368'
    }

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(500);
});
