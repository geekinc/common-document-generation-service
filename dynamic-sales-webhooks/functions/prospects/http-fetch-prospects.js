import { v4 as uuidv4 } from 'uuid';
import response from "../../lib/response-lib";
import { logger } from "../../lib/logger-lib";
import { sleep } from "../../lib/general-lib";

const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
    region: process.env.region,
});

/***********************************************************************************************************************
 * Security Requirements:
 * None - this is wide open
 ***********************************************************************************************************************/

export async function main(event, context) {
    console.log("fetch-prospects", event);

    const accountId = process.env.account_id;
    const queueUrl = `https://sqs.ca-central-1.amazonaws.com/${accountId}/${process.env.queue_requests}`;
    console.log(queueUrl);

    console.log(event.body);

    let var_record = {};
    try {
        //  parse data from APIs
        if (event.body) {
            var_record = [await JSON.parse(atob(event.body))];   // Need to base64 decode the body for some reason???
        }
    } catch (e) {
        if (event.body) {
            var_record = [await JSON.parse(event.body)];   // Need to base64 decode the body for some reason???
        }
    }

    try {

        console.log(var_record);

        // Structure the message for SQS
        let message = var_record;

        // SQS message parameters
        const params = {
            MessageBody: JSON.stringify(message),
            QueueUrl: queueUrl,
            MessageGroupId: (await uuidv4()),
            MessageDeduplicationId: (await uuidv4())
        };
        console.log(params);

        await sqs.sendMessage(params).promise().then(
            function (data) {
                console.info("data:", data);
            }
        );
        await sleep(100);

        return response.success({
            status: 200,
            error: null
        });
    } catch(e) {
        console.error(e);
        return response.failure({"status": 500, "error": e});
    }
}
