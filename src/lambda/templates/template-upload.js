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

    let user;
    /* istanbul ignore next */
    if (event.requestContext && event.requestContext.authorizer) {
        user = event.requestContext.authorizer.claims['username'] ? event.requestContext.authorizer.claims['username'] : 'no-user';
    } else {
        user = 'no-user';
    }

    let private_status = false;
    /* istanbul ignore next */
    if (event.queryStringParameters && event.queryStringParameters.hasOwnProperty('private')) {
        private_status = truthy(event.queryStringParameters.private);
    }

    let strict = false;
    /* istanbul ignore next */
    if (event.queryStringParameters && event.queryStringParameters.hasOwnProperty('strict')) {
        strict = truthy(event.queryStringParameters.strict);
    }

    // Grab the data from the multipart form
    let data = await parser.parse(event);
    data = data.files;

    let files = [];
    let fileHashes = [];
    for (let i = 0; i < data.length; i++) {
        /* istanbul ignore next */
        if (data[i].filename) {
            try {
                const timestamp = unixTimestamp();
                await s3.putObject({
                    Bucket: process.env.S3_BUCKET,
                    Key: "template-" + timestamp.toString() + "-" + data[0].filename,
                    ACL: 'public-read',
                    Body: data[i].content
                }).promise();
                const processed = await process_file(data[i], user, private_status, strict, timestamp);
                fileHashes.push(processed[0]);
            } catch (err) {
                await logger.error(JSON.stringify(err, null, 2));
                return { statusCode: 500, body: JSON.stringify({message: err.stack}) }
            }
            files.push({link: `${process.env.S3_ENDPOINT}/${data[i].filename}`});
        }
    }

    // TODO: this return response only returns the hash of the first file - this needs to be revisited
    return {
        statusCode: 200,
        headers: {
            "X-Template-Hash": fileHashes[0].carbone_id
        },
        body: JSON.stringify(fileHashes)
    }
}

export async function process_file(file_data, user, private_status, strict, timestamp) {
    await logger.info('template-upload.process_file() - called');

    // Create a new template record to reflect the new file
    let templateResult;
    /* istanbul ignore next */
    const templateData = {
        filename: file_data.filename,
        filetype: file_data.contentType,
        private_status: truthy(private_status) ? 1 : 0,
        strict: truthy(strict) ? 1 : 0,
        storage_location: "template-" + timestamp.toString() + "-" + file_data.filename,
        created_on: timestamp
    }
    try {
        templateResult = await Templates.createTemplate(templateData, user);
    } catch (err) /* istanbul ignore next */ {
        await logger.error('template-upload.process_file() - Templates.createTemplate exception with error: ' + err);
        throw new Error(err);
    }

    // Save file to temporary directory
    try {
        const tempDir = os.tmpdir();
        const tempFilePath = `${tempDir}/${file_data.filename}`;
        await fs.writeFileSync(tempFilePath, file_data.content);
    } catch (err) /* istanbul ignore next */ {
        await logger.error('template-upload.process_file() - fs.writeFileSync exception with error: ' + err);
        throw new Error(err);
    }

    // Upload the file to carbone
    let carboneResult;
    try {
        const tempDir = os.tmpdir();
        const tempFilePath = `${tempDir}/${file_data.filename}`;
        carboneResult = await carbone.addTemplate(tempFilePath);
    } catch (err) /* istanbul ignore next */ {
        await logger.error('template-upload.process_file() - carbone.addTemplate exception with error: ' + err);
        throw new Error(err);
    }

    // Check that the upload worked
    /* istanbul ignore next */
    if (carboneResult.status !== 'success') {
        await logger.error('template-upload.process_file() - carbone.addTemplate failed with error: ' + carboneResult.data);
        throw new Error(carboneResult.data);
    }

    // Update the template record with the carbone id
    try {
        await Templates.updateTemplate(templateResult.insertId, {carbone_id: carboneResult.data.data.templateId});
    } catch (err) /* istanbul ignore next */ {
        await logger.error('template-upload.process_file() - Templates.updateTemplate exception with error: ' + err);
        throw new Error(err);
    }

    // Get the template record and return it
    return await Templates.getTemplateById(templateResult.insertId);
}
