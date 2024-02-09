import AWS from "aws-sdk";  // Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/
import parser from 'partparse';
import { logger } from '../../lib/logger-lib.js'
import Templates from '../../lib/template-lib.js';
import { truthy, unixTimestamp } from "../../lib/utils-lib.js";
import * as carbone from '../../lib/carbone-lib.js';
import os from 'os'
import * as fs from "fs";
let s3;

/* istanbul ignore else */
if (process.env.S3_ENDPOINT === 'http://localhost:4569') {          // Local config
    s3 = new AWS.S3({
        s3ForcePathStyle: true,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        endpoint: process.env.S3_ENDPOINT,
    });
} else {                                                            // AWS config
    s3 = new AWS.S3({
        s3ForcePathStyle: true,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    });
}

// Process the template upload
// For each file in the multipart form, upload to S3 and return the link
// Take the link and update the template database
//
export async function handler (event, context, callback) {
    await logger.info(JSON.stringify(event, null, 2));

    const user = event.requestContext.authorizer.claims['username'] ? event.requestContext.authorizer.claims['username'] : 'no-user';
    const hash = event.pathParameters.uid;

    // TODO: build check cache functionality and authentication validation here

    return {
        statusCode: 200,
        body: JSON.stringify({carbone_id: hash})
    }
}
