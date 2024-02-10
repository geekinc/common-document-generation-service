import AWS from "aws-sdk";  // Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/
import { logger } from '../../lib/logger-lib.js'
import Templates from '../../lib/template-lib.js';
import * as carbone from '../../lib/carbone-lib.js';
import * as telejson from 'telejson';
import format from 'string-template';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import Joi from "joi";
import {retrieveDocument} from "../../lib/carbone-lib.js";
import {getAllMethods, getContentType, unixTimestamp} from "../../lib/utils-lib.js";
import { process_file } from "./template-upload.js";
let s3;
/* istanbul ignore file */

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
    formatters: Joi
        .string()
        .description("A string that can be transformed into an object. See https://www.npmjs.com/package/telejson for transformations, and https://carbone.io/documentation.html#formatters for more on formatters."),
    options: Joi
        .object()
        .default({})
        .description("Object containing processing options"),
    template: Joi
        .object()
        .default({})
        .description("The template object"),
});

// Process the template upload
// For each file in the multipart form, upload to S3 and return the link
// Take the link and update the template database
//
export async function handler (event, context, callback) {
    await logger.info(JSON.stringify(event, null, 2));

    // console.log(event);
    let user;
    /* istanbul ignore next */
    if (event.requestContext && event.requestContext.authorizer) {
        user = event.requestContext.authorizer.claims['username'] ? event.requestContext.authorizer.claims['username'] : 'no-user';
    } else {
        user = 'no-user';
    }

    let body = telejson.parse(event.body, {allowFunction: true});

    // Validate the body
    let {error, value} = await bodySchema.validate(body);
    /* istanbul ignore next */
    if (error) {
        await logger.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: error})
        }
    }

    // Upload the Base64 encoded template
    const localTemplate = body.template.content;
    let bodyFormData = new FormData();
    bodyFormData.append('template', localTemplate);
    let axiosResponse = await axios({
        method: "post",
        url: process.env.API_SERVER + "/template",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    })
        .then(function (response) {
            //handle success
            // console.log(response);
        })
        .catch(function (response) {
            //handle error
            // console.log(response);
        });

    const timestamp = unixTimestamp();
    const file = {
        filename: "inline-template-" + timestamp.toString() + "." + body.template.fileType,
        contentType: getContentType(body.template.fileType),
        content: Buffer.from(body.template.content, 'base64')
    }
    await s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: file.filename,
        ACL: 'public-read',
        Body: file.content
    }).promise();

    const processed = await process_file(file, user, false, false, timestamp);
    const hash = processed[0].carbone_id;

    // Determine if the template is already in the database
    const templates = await Templates.getTemplateByHash(hash);
    /* istanbul ignore next */
    if (templates.length === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({error: 'Template not found'})
        }
    }
    const template = templates[0];

    // Populate the data object  (Since it was validated above, no need for error checking)
    let data = body.data;

    // Handle the formatters
    let localFormatters;
    try {
        localFormatters = await telejson.parse(body.formatters, {allowFunction: true});
    } catch (e) /* istanbul ignore next */ {
        // await logger.info(JSON.stringify({
        //     value: body.formatters,
        //     message: 'Formatters could not be parsed into formatters object. See \'https://www.npmjs.com/package/telejson\'.'
        // }));
    }

    // Populate the options object
    let options = body.options;
    /* istanbul ignore next */
    options.convertTo = options.convertTo || template.ext;
    /* istanbul ignore next */
    if (options.convertTo.startsWith('.')) {
        options.convertTo = options.convertTo.slice(1);
    }

    // Execute the string replacement for the report name
    options.reportName = format(options.reportName, data) + '.' + options.convertTo;

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
        // console.log(err)
        return {
            statusCode: 500,
            body: JSON.stringify({error: err})
        }
    }

    const returnResult = {
        statusCode: 200,
        headers: {
            "Content-Type": getContentType(options.convertTo),
            "Content-Disposition": `inline; filename="${options.reportName}"`,
            "X-Report-Name": options.reportName,
            "X-Template-Hash": template.carbone_id
        },
        body:  btoa(String.fromCharCode.apply(null, new Uint8Array(rendered.data))),
        isBase64Encoded: true
    }


    return returnResult;

}
