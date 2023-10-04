import { v4 as uuidv4 } from 'uuid';
import response from "../../lib/response-lib";
import { logger } from "../../lib/logger-lib";
import { sleep } from "../../lib/general-lib";
import { process_apollo } from "../../lib/apollo-lib";
import { getStoredProfilePageNumber, incrementStoredProfilePageNumber } from "../../lib/stored-profile-lib";
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
    console.log('-------------------');
    console.log('var_record');
    console.log('-------------------');
    console.log(var_record);

    // Structure the message to query
    let data = var_record;
    let csv;
    let apollo;
    let pageNumber;
    let people = [];

    // Fetch 3 pages of results
    for (let currentPage = 0; currentPage < 3; currentPage++ ) {

        try {
            // Process each message from the event
            console.log(data);
            pageNumber = await getStoredProfilePageNumber(data[0].id);
            apollo = await process_apollo(data[0], pageNumber);
            await incrementStoredProfilePageNumber(data[0].id);

            if (apollo.people.length > 0) {
                people = people.concat(apollo.people);
            } else {
                break;
            }
        } catch (e) {
            console.log(util.inspect(e, {showHidden: false, depth: null, colors: true, maxArrayLength: 500}));
            return {
                statusCode: 200,
                body: "Success - but empty results",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                }
            };
        }

    }

    // console.log(util.inspect(people, {showHidden: false, depth: null, colors: true, maxArrayLength: 500}));


    try {
        // console.log('-------------------');
        // console.log('people');
        // console.log('-------------------');
        // console.log(people);
        if (people.length > 0) {

            // Generate the CSV
            csv = await json2csv(people);

            // Handle breaking conditions
            if (people.length === 0) {
                return {
                    statusCode: 200,
                    body: "No results found",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Credentials": true
                    }
                };
            }

            if (process.env.stage !== 'local') {
                // Process the prospects
                for (let x = 0; x < apollo.people.length; x++) {
                    // deep copy of prospect
                    let prospect = JSON.parse(JSON.stringify(apollo.people[x]));
                    prospect.customer = data[0].customer;
                    prospect.batch_id = data[0].id;
                    prospect.batch_count_number = apollo.people.length;
                    prospect.batch_count_total = data[0].count;
                    prospect.usage_type = data[0].usage_type;
                    const options_process_prospect = {
                        MessageBody: JSON.stringify(prospect),
                        QueueUrl: queueUrl,
                        MessageGroupId: (data[0].id)
                    };

                    await sqs.sendMessage(options_process_prospect).promise()
                        .then(function (data) {
                            return {
                                statusCode: 200,
                                body: {},
                            };
                        })
                        .catch(function (err) {
                            console.log(err);
                            return {
                                statusCode: 500,
                                body: err,
                            };
                        });
                }
            }
        } else {
            csv = "No results found";
        }

        let result = csv.toString('utf-8');

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
                "Content-Type": "text/csv",
                "Cache-Control": "no-cache",
                "Content-disposition": "attachment; filename=download.csv"
            },
            body: result,
            isBase64Encoded: false
        };

    } catch(e) {
        console.error(e);
        return response.failure({"status": 500, "error": e});
    }

}
