import { v4 as uuidv4 } from 'uuid';
import response from "../../lib/response-lib";
import { logger } from "../../lib/logger-lib";
import { sleep } from "../../lib/general-lib";
import { process_apollo } from "../../lib/apollo-lib";
import { json2csv } from 'json-2-csv';

import util from "util";
const mysql = require('serverless-mysql')({
    library: require('mysql2'),
    config: {
        host     : process.env.rds_host,
        database : process.env.rds_database,
        user     : process.env.rds_user,
        password : process.env.rds_password,
        charset  : 'utf8mb4_unicode_ci'
    }
});
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
    region: process.env.region,
});

/***********************************************************************************************************************
 * Security Requirements:
 * None - this is wide open
 ***********************************************************************************************************************/

/***********************************************************************************************************************
 * Overview:
 * This endpoint will take the generalized hydration query and construct an apollo query
 * It will then process the apollo query and send the results to the process-prospect endpoint
 * At the same time, it will collate the results and return them as a CSV file
 ***********************************************************************************************************************/

export async function main(event, context) {
    console.log("download-prospects", event);

    const accountId = process.env.account_id;
    const queueUrl = `https://sqs.ca-central-1.amazonaws.com/${accountId}/${process.env.queue_prospects}`;
    const queueExportUrl = `https://sqs.ca-central-1.amazonaws.com/${accountId}/${process.env.queue_export_prospects}`;

    try {
        let var_record = {};
        //  parse data from APIs
        if (event.body) {
            var_record = [await JSON.parse(event.body)];
        }

        // Structure the message to query
        let data = var_record;
        let csv;

        try {
            // Process each message from the event
            console.log(data);

            let totalRequired = data[0].count;
            let totalProcessed = 0;
            let pageNumber = 1;
            let apollo = await process_apollo(data[0], pageNumber);

            // Generate the CSV
            csv = await json2csv(apollo.people);

            // while (totalProcessed < totalRequired) {
            //     let apollo = await process_apollo(data[0], pageNumber);  // process the first entry in the array
            //
            //     if (apollo) {
            //         // Handle breaking conditions
            //         if (apollo.people.length === 0) {
            //             break;
            //         }
            //         if (apollo.people.length < 200) {
            //             break;
            //         }
            //         if (apollo.pagination.page === apollo.pagination.total_pages) {
            //             break;
            //         }
            //         if (apollo.pagination.total_entries <= totalRequired) {
            //             break;
            //         }
            //
            //         // Process the prospects
            //         for (let x = 0; x < apollo.people.length; x++) {
            //             // deep copy of prospect
            //             let prospect = JSON.parse(JSON.stringify(apollo.people[x]));
            //             prospect.customer = data[0].customer;
            //             prospect.batch_id = data[0].id;
            //             prospect.batch_count_number = totalProcessed + x;
            //             prospect.batch_count_total = totalRequired;
            //             prospect.usage_type = data[0].usage_type;
            //             const options_process_prospect = {
            //                 MessageBody: JSON.stringify(prospect),
            //                 QueueUrl: queueUrl,
            //                 MessageGroupId: (data[0].id)
            //             };
            //             await sqs.sendMessage(options_process_prospect).promise().then(
            //                 function (data) {
            //                     return {
            //                         statusCode: 200,
            //                         body: {},
            //                     };
            //                 });
            //         }
            //         totalProcessed += apollo.people.length;
            //     }
            //     pageNumber++;   // increment the page number
            // }
            //
            // // Mark the page number in the database for this profile
            // await mysql.query({
            //     sql: 'UPDATE `stored-profiles` SET `hydration_page_number` = ? WHERE `id` = ?',
            //     timeout: 10000, // 10s
            //     values: [pageNumber, data[0].id]
            // });
            //
            // // Trigger new process to export the data and email it
            // if (data[0].usage_type === 'email_export') {
            //     // Create a delay to allow the other data to complete processing
            //     await new Promise(resolve => setTimeout(resolve, 10000));  // 10 second delay
            //
            //     const message = {
            //         "batch_id": data[0].id,
            //         "customer": data[0].customer,
            //         "usage_type": data[0].usage_type,
            //         "batch_size": totalRequired
            //     };
            //     const options_process_export = {
            //         MessageBody: JSON.stringify(message),
            //         QueueUrl: queueExportUrl,
            //         MessageGroupId: (await uuidv4()),
            //         MessageDeduplicationId: (await uuidv4())
            //     };
            //     await sqs.sendMessage(options_process_export).promise().then(
            //         function (data) {
            //             return {
            //                 statusCode: 200,
            //                 body: {},
            //             };
            //         });
            // }
            //
            // // TODO: Create other export types (direct to account, external CMS API, etc...)

            // console.log("Total Required: " + totalRequired);
            // console.log("Total Processed: " + totalProcessed);
        } catch (e) {
            console.log(util.inspect(e, {showHidden: false, depth: null, colors: true, maxArrayLength: 500}));
            return {
                statusCode: 200,
                body: "Success - but empty results",
            };
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "text/csv",
                "Cache-Control": "no-cache",
                "Content-disposition": "attachment; filename=download.csv"
            },
            body: csv.toString('utf-8'),
            isBase64Encoded: false
        };

    } catch(e) {
        console.error(e);
        return response.failure({"status": 500, "error": e});
    }
}
