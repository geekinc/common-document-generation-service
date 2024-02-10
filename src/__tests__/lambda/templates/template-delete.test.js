import {Context, Event} from "../../../lib/serverless-lib.js";
import { handler as uploadHandler } from '../../../lambda/templates/template-upload.js';
import { handler as deleteHandler } from '../../../lambda/templates/template-delete.js';
process.env.LOG_LEVEL = 'off';

// Mock the AWS SDK for these tests
jest.mock('aws-sdk', () => {
    const S3Mocked = {
        putObject: jest.fn().mockReturnThis(),
        deleteObject: jest.fn().mockReturnThis(),
        promise: jest.fn()
    };
    return {
        S3: jest.fn(() => S3Mocked)
    };
});

/**
 * Happy Path - upload and delete a single text based file
 */
test('template-delete - upload and delete a single text based file', async () => {
    let event = new Event();
    event.requestContext = {
        authorizer: {
            claims: {
                username: 'foo'
            }
        }
    };
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
    let result = await uploadHandler(event, context);

    // Add the path parameter to delete the correct id
    let deleteEvent = new Event();
    let deleteContext = new Context();
    deleteEvent.pathParameters = {
        uid: (JSON.parse(result.body))[0].carbone_id
    };
    deleteEvent.requestContext = {
        authorizer: {
            claims: {
                username: 'foo'
            }
        }
    };

    // call delete method
    let deleteResult = await deleteHandler(deleteEvent, deleteContext);

    // Check the response
    expect(deleteResult.statusCode).toBe(200);
});

/**
 * Broken Path - delete a missing single text based file
 */
test('template-delete - upload and delete a single text based file', async () => {
    // Add the path parameter to delete the correct id
    let deleteEvent = new Event();
    let deleteContext = new Context();
    deleteEvent.pathParameters = {
        uid: 'A_BROKEN_ID_THAT_DOES_NOT_EXIST'
    };
    deleteEvent.requestContext = {
        authorizer: {
            claims: {
                username: 'foo'
            }
        }
    };

    // call delete method
    let deleteResult = await deleteHandler(deleteEvent, deleteContext);

    // Check the response
    expect(deleteResult.statusCode).toBe(404);
});

