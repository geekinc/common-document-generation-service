import AWS from "aws-sdk";  // Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/
import { logger } from '../../lib/logger-lib.js'
import Templates from '../../lib/template-lib.js';
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

    const hash = event.pathParameters.uid;
    let download = false;
    /* istanbul ignore next */
    if (event.queryStringParameters && event.queryStringParameters.hasOwnProperty('download')) {
        download = event.queryStringParameters.download !== false;
    }

    // Determine if the template is already in the database
    const templates = await Templates.getTemplateByHash(hash);
    /* istanbul ignore next */
    if (templates.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({error: 'Template not found'})
        }
    }

    /* istanbul ignore next */
    if (download) {
        const template = templates[0];
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: template.storage_location
        };

        const object = await s3.getObject(params).promise();
        return {
            statusCode: 200,
            headers: {
                "Content-Type": template.filetype,
                "Content-Disposition": `inline; filename="${template.filename}"`
            },
            body: object.Body.toString("base64"),
            isBase64Encoded: true
        }
    }

    return {
        statusCode: 200,
        body: 'OK'
    }
}
