import { json2csv } from 'json-2-csv';
import { v4 as uuidv4 } from 'uuid';
import util from "util";
import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';
import {coordinator} from "../../lib/coordinator-lib";
const axios = require("axios");
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

const setupMailClient = async () => {
    sgMail.setApiKey(process.env.sendgrid_api_key);
    sgClient.setApiKey(process.env.sendgrid_api_key);
    sgClient.setDefaultHeader("Content-Type", "application/json");
};

export async function main(event, context, req) {
    try {
        // Process each message from the event
        for (let record of event.Records) {
            let data = JSON.parse(record.body);
            console.log(data);

            // Return the data with a customer email to send the results
            // If no email is found, use a default email, in this case, mine
            let results = await mysql.query(
                "SELECT " +
                "   IFNULL(c.email, 'ben@dynamicsales.com') as email, p.json_data " +
                " FROM `customer_prospects` as cp " +
                " INNER JOIN prospects as p ON cp.prospect_id = p.id " +
                " INNER JOIN customers as c ON cp.customer_id = c.id " +
                " WHERE cp.customer_id = ?" +
                " and " +
                " cp.batch_id = ?" +
                " and " +
                " cp.last_used is NULL " +
                " limit ?",
                [
                    data.customer,
                    data.batch_id,
                    data.batch_size
                ]);

            let output = [];
            for (let x = 0; x < results.length; x++) {
                output.push(results[x].json_data);
            }

            // Fetch the customer email
            let highlevel_options = {
                url: 'https://rest.gohighlevel.com/v1/locations/j154Pwy9QxY9VzduMzsw',
                timeout: 5000,
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + process.env.highlevel_api_key,
                }
            };
            let highlevel_response = await axios.request(highlevel_options).then(function (response) {
                return response.data;
            }).catch(function (error) {
                console.error(error);
                return 0;
            });
            let customer_email = highlevel_response?.email;
            console.log(highlevel_response);
            console.log(customer_email);


            // Generate the CSV
            const csv = await json2csv(output);

            // Set up the email service
            await setupMailClient();
            const msg = {
                to: customer_email,
                from: 'hello@dynamicsales.com',
                subject: 'Latest Prospects',
                text: 'Here are your prospects.',
                html: '<strong>Here are your prospects.</strong>',
                attachments: [
                    {
                        content: Buffer.from(csv).toString('base64'),
                        filename: 'prospects.csv',
                        type: 'text/csv',
                        disposition: 'attachment'
                    },
                ],
            };
            await sgMail.send(msg)
                .then(data => {
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                });

            await new Promise(resolve => setTimeout(resolve, 5000));  // 5 second delay

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
