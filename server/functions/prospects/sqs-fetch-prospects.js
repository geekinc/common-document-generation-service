import { coordinator } from "../../lib/coordinator-lib";
import { getIndustryIDsFromNames } from "../../lib/general-lib";
import util from "util";
import {v4 as uuidv4} from "uuid";
const axios = require("axios");
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
    region: process.env.region,
});

function processEmployeeCounts(employees) {
    // swap the '-' with a ',' for each entry in the array
    let new_employees = [];
    for (let i = 0; i < employees.length; i++) {
        new_employees.push(employees[i].replace('-', ','));
    }
    return new_employees;
}

async function process_apollo(query, pageNumber = 1) {

    // Call apollo API with the details from the request
    let apollo_options = {
        url: 'https://api.apollo.io/v1/mixed_people/search',
        timeout: 5000,
        method: 'POST',
        data: {
            "api_key": await coordinator.api_key('apollo.io'),
            "contact_email_status": ["verified"],
            "per_page": 200,
            "page": pageNumber
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Add the various parameters to the query based on if they exist or not
    if (query.job_title) {
        apollo_options.data.person_titles = query.job_title;
    }

    if (query.location) {
        apollo_options.data.person_locations = query.location;
    }

    if (query.industry) {
        apollo_options.data.organization_industry_tag_ids = getIndustryIDsFromNames(query.industry);
    }

    if (query.number_of_employees) {
        apollo_options.data.organization_num_employees_ranges = processEmployeeCounts(query.number_of_employees);
    }

    if (query.company_revenue_max && query.company_revenue_min && query.company_revenue_max > query.company_revenue_min) {
        apollo_options.data.revenue_range = {
            "max": query.company_revenue_max.toString(),
            "min": query.company_revenue_min.toString()
        };
    }

    return await axios.request(apollo_options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.error(error);
        return 0;
    });
}

export async function main(event, context, req) {
    const accountId = process.env.account_id;
    const queueUrl = `https://sqs.ca-central-1.amazonaws.com/${accountId}/${process.env.queue_prospects}`;
    const queueExportUrl = `https://sqs.ca-central-1.amazonaws.com/${accountId}/${process.env.queue_export_prospects}`;

    try {
        // Process each message from the event
        for (let record of event.Records) {
            let data = JSON.parse(record.body);

            let totalRequired = data[0].count;
            let totalProcessed = 0;
            let pageNumber = 1;
            while (totalProcessed < totalRequired) {
                let apollo = await process_apollo(data[0], pageNumber);  // process the first entry in the array

                if (apollo) {
                    // Handle breaking conditions
                    if (apollo.people.length === 0) {
                        break;
                    }
                    if (apollo.people.length < 200) {
                        break;
                    }
                    if (apollo.pagination.page === apollo.pagination.total_pages) {
                        break;
                    }
                    if (apollo.pagination.total_entries <= totalRequired) {
                        break;
                    }

                    // Process the prospects
                    for (let x = 0; x < apollo.people.length; x++) {
                        // deep copy of prospect
                        let prospect = JSON.parse(JSON.stringify(apollo.people[x]));
                        prospect.customer = data[0].customer;
                        prospect.batch_id = data[0].id;
                        prospect.batch_count_number = totalProcessed + x;
                        prospect.batch_count_total = totalRequired;
                        prospect.usage_type = data[0].usage_type;
                        const options_process_prospect = {
                            MessageBody: JSON.stringify(prospect),
                            QueueUrl: queueUrl,
                            MessageGroupId: (data[0].id)
                        };
                        await sqs.sendMessage(options_process_prospect).promise().then(
                            function (data) {
                                return {
                                    statusCode: 200,
                                    body: {},
                                };
                            });
                    }
                    totalProcessed += apollo.people.length;
                }

            }

            // Trigger new process to export the data and email it
            if (data[0].usage_type === 'email_export') {
                // Create a delay to allow the other data to complete processing
                await new Promise(resolve => setTimeout(resolve, 10000));  // 10 second delay

                const message = {
                    "batch_id": data[0].id,
                    "customer": data[0].customer,
                    "usage_type": data[0].usage_type,
                    "batch_size": totalRequired
                };
                const options_process_export = {
                    MessageBody: JSON.stringify(message),
                    QueueUrl: queueExportUrl,
                    MessageGroupId: (await uuidv4()),
                    MessageDeduplicationId: (await uuidv4())
                };
                await sqs.sendMessage(options_process_export).promise().then(
                    function (data) {
                        return {
                            statusCode: 200,
                            body: {},
                        };
                    });
            }

            // TODO: Create other export types (direct to account, external CMS API, etc...)

            console.log("Total Required: " + totalRequired);
            console.log("Total Processed: " + totalProcessed);
        }
    } catch (e) {
        console.log(util.inspect(e, {showHidden: false, depth: null, colors: true, maxArrayLength: 500}));
        return {
            statusCode: 200,
            body: {},
        };
    }

    return {
        statusCode: 200,
        body: {},
    };
}
