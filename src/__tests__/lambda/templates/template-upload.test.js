import {Context, Event} from "../../../lib/serverless-lib.js";
const { handler } = require('../../../lambda/templates/template-upload.js');
process.env.LOG_LEVEL = 'off';

// Mock the AWS SDK for these tests
jest.mock('aws-sdk', () => {
    const S3Mocked = {
        putObject: jest.fn().mockReturnThis(),
        promise: jest.fn()
    };
    return {
        S3: jest.fn(() => S3Mocked)
    };
});

/**
 * Happy Path - upload a single text based file
 */
test('template-upload - upload a single text based file', async () => {
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
    expect(result.statusCode).toBe(200);
});

/**
 * Happy Path - upload multiple text based files
 */
test('template-upload - upload multiple text based files', async () => {
    let event = new Event();
    let context = new Context();

    // Set the JSON body
    event.body = '----------------------------714674260680485913450873\r\n' +
        'Content-Disposition: form-data; name="file"; filename="test.xml"\r\n' +
        'Content-Type: application/xml\r\n' +
        '\r\n' +
        '<note>\r\n' +
        '<to>All</to>\r\n' +
        '<from>Common Document Generator Service</from>\r\n' +
        '<heading>Test</heading>\r\n' +
        '<body>This is a test of the emergency broadcast system.\r\n' +
        '\r\n' +
        'This is a test.\r\n' +
        '\r\n' +
        'This is only a test.\r\n' +
        '\r\n' +
        "Had this been a real emergency, you'd be dead.\r\n" +
        '\r\n' +
        'Have a nice day.</body>\r\n' +
        '</note>\r\n' +
        '\r\n' +
        '----------------------------714674260680485913450873\r\n' +
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
        '----------------------------714674260680485913450873--\r\n';

    event.headers = {
        Accept: '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': '7e3b246d-fc6e-4072-8d80-d54ba3d67593',
        Host: 'localhost:3500',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Content-Type': 'multipart/form-data; boundary=--------------------------714674260680485913450873',
        'Content-Length': '804'
    }

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(200);
});


/**
 * Happy Path - upload a single binary file
 */
test('template-upload - upload a single binary file', async () => {
    let event = new Event();
    let context = new Context();

    // Set the JSON body
    event.body = '----------------------------944337558570497785247388\r\n' +
        'Content-Disposition: form-data; name="file"; filename="tiny.png"\r\n' +
        'Content-Type: image/png\r\n' +
        '\r\n' +
        '\x89PNG\r\n' +
        '\x1A\n' +
        '\x00\x00\x00\rIHDR\x00\x00\x00\x18\x00\x00\x00\x18\b\x02\x00\x00\x00o\x15ª¯\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\x9A\x9C\x18\x00\x00\x00"IDAT8\x8Dcd\x10úÏ@\rÀD\x15SF\r\x1A5hÔ Q\x83F\r\x1A5\x88"\x00\x00ô¸\x01A\tÉ*¬\x00\x00\x00\x00IEND®B`\x82\r\n' +
    '----------------------------944337558570497785247388--\r\n';

    event.headers = {
        Accept: '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': '70388161-d068-4b1b-89f7-68202f44aa0b',
        Host: 'localhost:3500',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Content-Type': 'multipart/form-data; boundary=--------------------------944337558570497785247388',
        'Content-Length': '317'
    }

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(200);
});


/**
 * Happy Path - upload multiple binary files
 */
test('template-upload - upload multiple binary files', async () => {
    let event = new Event();
    let context = new Context();

    // Set the JSON body
    event.body = '----------------------------362434035639010248573148\r\n' +
        'Content-Disposition: form-data; name="file"; filename="tiny.png"\r\n' +
        'Content-Type: image/png\r\n' +
        '\r\n' +
        '\x89PNG\r\n' +
        '\x1A\n' +
        '\x00\x00\x00\rIHDR\x00\x00\x00\x18\x00\x00\x00\x18\b\x02\x00\x00\x00o\x15ª¯\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\x9A\x9C\x18\x00\x00\x00"IDAT8\x8Dcd\x10úÏ@\rÀD\x15SF\r\x1A5hÔ Q\x83F\r\x1A5\x88"\x00\x00ô¸\x01A\tÉ*¬\x00\x00\x00\x00IEND®B`\x82\r\n' +
        '----------------------------362434035639010248573148\r\n' +
        'Content-Disposition: form-data; name="file"; filename="tiny.gif"\r\n' +
        'Content-Type: image/gif\r\n' +
        '\r\n' +
        'GIF89a\x18\x00\x18\x00\x80\x00\x00úí%ÿÿÿ!ù\x04\x05\x00\x00\x01\x00,\x00\x00\x00\x00\x18\x00\x18\x00\x00\x02\x16\x84\x8F©Ëí\x0F£\x9C´Ú\x8B³Þ¼û\x0F\x86âH\x96S\x01\x00;\r\n' +
        '----------------------------362434035639010248573148--\r\n';

    event.headers = {
        Accept: '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': 'ce9a4594-3595-47d9-8825-bc9682ea7090',
        Host: 'localhost:3500',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Content-Type': 'multipart/form-data; boundary=--------------------------362434035639010248573148',
        'Content-Length': '529'
    }

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toStrictEqual(
        [
            {link: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/tiny.png`},
            {link: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/tiny.gif`}
        ]
    );
});
