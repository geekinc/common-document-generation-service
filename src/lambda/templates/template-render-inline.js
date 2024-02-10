import AWS from "aws-sdk";  // Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/
import { logger } from '../../lib/logger-lib.js'
import Templates from '../../lib/template-lib.js';
import * as carbone from '../../lib/carbone-lib.js';
import * as telejson from 'telejson';
import path from 'path';
import Joi from "joi";
import {retrieveDocument} from "../../lib/carbone-lib.js";
import {getContentType, octetStreamToBase64} from "../../lib/utils-lib.js";
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

const bodySchema = Joi.object({
    data: Joi
        .object()
        .default({})
        .description("A freeform JSON object of key-value pairs or array of freeform JSON object key-value pairs. All keys must be alphanumeric or underscore."),
    // formatters: Joi
    //     .string()
    //     .description("A string that can be transformed into an object. See https://www.npmjs.com/package/telejson for transformations, and https://carbone.io/documentation.html#formatters for more on formatters.")
    //     .required(),
    options: Joi
        .object()
        .default({})
        .description("Object containing processing options"),
});

// Process the template upload
// For each file in the multipart form, upload to S3 and return the link
// Take the link and update the template database
//
export async function handler (event, context, callback) {
    await logger.info(JSON.stringify(event, null, 2));

    let body = JSON.parse(event.body);
    // console.log(1);

    const user = event.requestContext.authorizer.claims['username'] ? event.requestContext.authorizer.claims['username'] : 'no-user';
    const hash = event.pathParameters.uid;

    // console.log(2);

    // Validate the body
    let {error, value} = await bodySchema.validate(body);
    if (error) {
        await logger.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: error})
        }
    }

    // console.log(3);

    // Determine if the template is already in the database
    const templates = await Templates.getTemplateByHash(hash);
    if (templates.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({error: 'Template not found'})
        }
    }
    const template = templates[0];

    // Populate the options object
    let options = body.options;
    options.reportName = 'download';


    // Populate the data object  (Since it was validated above, no need for error checking)
    let data = body.data;

    // Generate document using carbone
    let document;
    try {
        document = await carbone.generateDocument(template.carbone_id, data, options);
    } catch (err) /* istanbul ignore next */ {
        await logger.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({error: err})
        }
    }
    const documentId = document.data.data.renderId;

    // Fetch the rendered document
    let rendered;
    try {
        rendered = await carbone.retrieveDocument(documentId);
    } catch (err) /* istanbul ignore next */ {
        // await logger.error(err);
        console.log(err)
        return {
            statusCode: 500,
            body: JSON.stringify({error: err})
        }
    }

    const returnResult = {
        statusCode: 200,
        headers: {
            "Content-Type": getContentType(options.convertTo),
            // "Content-Type": 'application/octet-stream',
            // 'content-type': 'application/pdf',
            "Content-Disposition": `inline; filename="${options.reportName}"`,
            "X-Report-Name": options.reportName,
            "X-Template-Hash": template.carbone_id
        },
        body:  btoa(String.fromCharCode.apply(null, new Uint8Array(rendered.data))),
        isBase64Encoded: true
    }


    return returnResult;

}
