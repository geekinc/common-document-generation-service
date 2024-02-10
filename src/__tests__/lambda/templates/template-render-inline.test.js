import {Context, Event} from "../../../lib/serverless-lib.js";
import { handler as renderInlineHandler } from '../../../lambda/templates/template-render-inline.js';
import * as fs from "fs";
import os from "os";
import {logger} from "../../../lib/logger-lib.js";
import {unixTimestamp} from "../../../lib/utils-lib.js";
process.env.LOG_LEVEL = 'off';

// We don't want to mock the AWS SDK for these tests
// Since we need to store and upload data, we need to use the real AWS SDK (but on the local system)

// jest.mock('aws-sdk', () => {
//     const S3Mocked = {
//         putObject: jest.fn().mockReturnThis(),
//         deleteObject: jest.fn().mockReturnThis(),
//         getObject: jest.fn().mockReturnThis(),
//         promise: jest.fn()
//     };
//     return {
//         S3: jest.fn(() => S3Mocked)
//     };
// });

let templateFileBase64 = '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';


/**
 * Happy Path - upload and render a basic template
 */
test('template-render-id - upload and render a basic template', async () => {

    let renderInlineEvent = new Event();
    let renderInlineContext = new Context();
    renderInlineEvent.body = JSON.stringify({
        "data":{
            "firstName": "Ben",
            "lastName": "Inkster",
            "companyName":"JohnInsurance & Co",
            "period":2,
            "sD":1659041229,
            "id":2891,
            "insured":{
                "name":"Jean Michel",
                "street":"23, Sycamore Street",
                "city":"New York",
                "phone":"+33 2 38 99 18 23"
            },
            "showPropertyDamage":false,
            "propertyDamage":[
                {
                    "type":"Fire"
                },
                {
                    "type":"Wind"
                },
                {
                    "type":"Hail"
                },
                {
                    "type":"Water"
                }
            ],
            "options":[
                {
                    "type":"Furniture",
                    "note":"/",
                    "cost":1200
                },
                {
                    "type":"Appliances",
                    "note":"/",
                    "cost":400
                },
                {
                    "type":"Clothing",
                    "note":"/",
                    "cost":300
                },
                {
                    "type":"Dishes",
                    "note":"in some cases",
                    "cost":300
                }
            ],
            "optionsTotalHT":2200,
            "optionsTaxes":10,
            "optionsTotal":2420
        },
        "formatters": "{\"myFormatter\":\"_function_myFormatter|function(data) { return data.slice(1); }\",\"myOtherFormatter\":\"_function_myOtherFormatter|function(data) {return data.slice(2);}\"}",
        "options": {
            "convertTo": "pdf",
            "overwrite": true,
            "reportName": "abc_123_{firstName}_{lastName}"
        },
        "template": {
            "encodingType": "base64",
            "fileType": "odt",
            "content": templateFileBase64
        }

    });
    renderInlineEvent.requestContext = {
        authorizer: {
            claims: {
                username: 'foo'
            }
        }
    };

    // call delete method
    let renderInlineResult = await renderInlineHandler(renderInlineEvent, renderInlineContext);

    // Save file to temporary directory
    try {
        const timestamp = unixTimestamp();
        const tempDir = os.tmpdir();
        const tempFilePath = `${tempDir}/${timestamp}-${renderInlineResult.headers['X-Report-Name']}`;
        await fs.writeFileSync(tempFilePath, renderInlineResult.body, 'base64');
    } catch (err) /* istanbul ignore next */ {
        // await logger.error('template-upload.process_file() - fs.writeFileSync exception with error: ' + err);
        throw new Error(err);
    }

    // Check the response
    expect(renderInlineResult.statusCode).toBe(200);
});