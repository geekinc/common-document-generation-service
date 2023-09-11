import { coordinator } from "../../lib/coordinator-lib";
import { getIndustryIDsFromNames } from "../../lib/general-lib";
import util from "util";
import {v4 as uuidv4} from "uuid";
const axios = require("axios");
const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
    region: process.env.region,
});

async function process_apollo(query) {

    // Call apollo API with the details from the request
    let apollo_options = {
        url: 'https://api.apollo.io/v1/mixed_people/search',
        timeout: 5000,
        method: 'POST',
        data: {
            "api_key": await coordinator.api_key('apollo.io'),
            "contact_email_status": ["verified"],
            "per_page": 1,
            "page": 1
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
        apollo_options.data.organization_num_employees_ranges = query.number_of_employees;
    }

    if (query.company_revenue_max && query.company_revenue_min && query.company_revenue_max > query.company_revenue_min) {
        apollo_options.data.revenue_range = {
            "max": query.company_revenue_max.toString(),
            "min": query.company_revenue_min.toString()
        };
    }

    console.log(apollo_options);

    return await axios.request(apollo_options).then(function (response) {
        console.log(response.data);
        return response.data;
    }).catch(function (error) {
        console.error(error);
        return 0;
    });
}

export async function main(event, context, req) {
    const accountId = process.env.account_id;
    // const queue_process_twitter = `https://sqs.ca-central-1.amazonaws.com/${accountId}/${process.env.queue_process_twitter}`;

    console.log(event);

    try {
        // Process each message from the event
        for (let record of event.Records) {
            let data = JSON.parse(record.body);
            console.log(util.inspect(data, {showHidden: false, depth: null, colors: true, maxArrayLength: 500}));

            let apollo = await process_apollo(data[0]);  // process the first entry in the array

            if (apollo) {

                console.log(apollo);

                // let queue_process_twitter_message = {
                //     entry_id: data.entry_id,
                //     ticker: data.ticker,
                //     twitter: parseInt(twitter) || 0,
                //     company_name: data.company_name,
                //     start_time: data.start_time,
                //     end_time: data.end_time
                // };
                // const queue_fetch_twitter_params = {
                //     MessageBody: JSON.stringify(queue_process_twitter_message),
                //     QueueUrl: queue_process_twitter,
                //     MessageGroupId: (await uuidv4()),
                //     MessageDeduplicationId: (await uuidv4())
                // };
                // await sqs.sendMessage(queue_fetch_twitter_params).promise().then(
                //     function (data) {
                //         console.info("data:", data);
                //         return {
                //             statusCode: 200,
                //             body: {},
                //         };
                //     });
            }
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
