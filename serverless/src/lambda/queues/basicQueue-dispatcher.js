import AWS from "aws-sdk";
import Joi from "joi";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "../../lib/logger-lib.js";

import { success, failure } from "../../lib/response-lib.cjs";

// const awsHelper = require("../utils/aws.helper.js");

const bodySchema = Joi.object({
    destination: Joi
        .string()
        .valid("basicQueue", "basicQueue.fifo")
        .description("The destination you want to forward the payload to")
        .required(),
    payload: Joi
        .object()
        .default({})
        .description("The message payload to forward to"),
});

export async function handler (event, context) {

    let body, parsedValue;

    try {
        // await logger.log(event.body)
        // await logger.log(JSON.parse(event.body));
        let {error, value} = await bodySchema.validate(JSON.parse(event.body));
        if (error) return failure({
            message: "Invalid request",
            data: {
                error,
            },
        });

        parsedValue = value;
    } catch (error) {
        return failure({
            message: "Invalid request",
            data: {
                error,
            },
        });
    }

    body = JSON.stringify(parsedValue);

    const sqs = new AWS.SQS({
        region: process.env.AWS_DEPLOY_REGION,
    });

    const id = uuidv4();
    let sqsOutput = await sqs.sendMessage({
        QueueUrl: 'http://localhost:9324/queue/basicQueue.fifo',
        MessageBody: body,
        MessageGroupId: id,
        MessageDeduplicationId: id,
        MessageAttributes: {
            AttributeNameHere: {
                StringValue: 'Attribute Value Here',
                DataType: 'String',
            },
        },
    }).promise();

    return success({
        message: "Message sent",
        data: {
            sqsOutput,
        },
    });


}
