import { coordinator } from "../libs/coordinator-lib";
import response from "../lib/response-lib";

/***********************************************************************************************************************
 * Security Requirements:
 * None - this is wide open
 ***********************************************************************************************************************/

export async function main(event, context) {
    console.log("fetch-prospects", event);
    console.log(event.pathParameters);
    let count = event.pathParameters.count;
    
    try {
        let api_key = await coordinator.api_key('apollo.io')  // Let the mutex handle delaying and assigning correct headers
        return response.success(api_key);
    } catch (exception) {
        return response.failure();
    } finally {
    }
}




// import util from "util";
// import {v4 as uuidv4} from "uuid";
// const axios = require("axios");
// const AWS = require("aws-sdk");
// const sqs = new AWS.SQS({
//     region: process.env.region,
// });
// import { coordinator } from "../../libs/coordinator-lib";
//
// async function process_twitter(query, start_time, end_time) {
//
//     // Call twitter API with a request for a count of the number of tweets for the query in this timeframe
//     const twitter_options = {
//         method: 'GET',
//         url: 'https://api.twitter.com/2/tweets/counts/recent',
//         params: {
//             query: '"' + query + '"',
//             start_time: (new Date(start_time * 1000).toISOString()),
//             end_time: (new Date(end_time * 1000).toISOString())
//         },
//         headers: await coordinator.headers('twitter')  // Let the mutex handle delaying and assigning correct headers
//     };
//     return await axios.request(twitter_options).then(function (response) {
//         return response.data.meta.total_tweet_count;
//     }).catch(function (error) {
//         console.error(error);
//         return 0;
//     });
// }

// export async function main(event, context, req) {
//     const accountId = process.env.account_id;
//     const queue_process_twitter = `https://sqs.ca-central-1.amazonaws.com/${accountId}/${process.env.queue_process_twitter}`;
//
//     try {
//         // Process each message from the event
//         for (let record of event.Records) {
//             let data = JSON.parse(record.body);
//             // console.log(util.inspect(data, {showHidden: false, depth: null, colors: true, maxArrayLength: 500}));
//
//             let twitter = await process_twitter(data.company_name, data.start_time, data.end_time);
//
//             if (twitter > 0) {
//                 let queue_process_twitter_message = {
//                     entry_id: data.entry_id,
//                     ticker: data.ticker,
//                     twitter: parseInt(twitter) || 0,
//                     company_name: data.company_name,
//                     start_time: data.start_time,
//                     end_time: data.end_time
//                 };
//                 const queue_fetch_twitter_params = {
//                     MessageBody: JSON.stringify(queue_process_twitter_message),
//                     QueueUrl: queue_process_twitter,
//                     MessageGroupId: (await uuidv4()),
//                     MessageDeduplicationId: (await uuidv4())
//                 };
//                 await sqs.sendMessage(queue_fetch_twitter_params).promise().then(
//                     function (data) {
//                         console.info("data:", data);
//                         return {
//                             statusCode: 200,
//                             body: {},
//                         };
//                     });
//             }
//         }
//     } catch (e) {
//         console.log(util.inspect(e, {showHidden: false, depth: null, colors: true, maxArrayLength: 500}));
//         return {
//             statusCode: 200,
//             body: {},
//         };
//     }
//
//     return {
//         statusCode: 200,
//         body: {},
//     };
// }
