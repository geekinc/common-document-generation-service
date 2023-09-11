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

    try {
        let var_method = 'API';
        let var_record = [];
        //  parse data from APIs
        if (event.body) {
            var_method = 'API';
            logger.info('API CALL');
            var_record = [...var_record, ...(await JSON.parse(event.body))];
        }

        //  parse data from SQS
        if (event.Records !== undefined) {
            var_method = 'SQS';
            logger.info('SQS QUEUE');
            var_record = [...var_record, ...(await JSON.parse(event.Records[0].body))];
        }

        console.log(var_record);

        // Loop for each fetch request
        for (let x = 0; x < var_record.length; x++) {
            // Structure the message for SQS
            let message = var_record[x];

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

        }
        return response.success({
            status: 200,
            error: null
        });
    } catch(e) {
        console.error(e);
        return response.failure({"status": 500, "error": e});
    }
}
