import { json2csv } from 'json-2-csv';
import { v4 as uuidv4 } from 'uuid';
import util from "util";
import sgMail from '@sendgrid/mail';
import sgClient from '@sendgrid/client';
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

            console.log('first result:');
            console.log(results[0].json_data);
            console.log('total to process:');
            console.log(results.length);

            let output = [];
            for (let x = 0; x < results.length; x++) {
                output.push(results[x].json_data);
            }

            // Generate the CSV
            const csv = await json2csv(output);
            console.log(csv);

            // Set up the email service
            await setupMailClient();
            const msg = {
                to: results[0].email,
                from: 'Dynamic Sales',
                subject: 'Latest Prospects',
                text: 'Here are your prospects.',
                html: '<strong>Here are your prospects.</strong>',
                attachments: [
                    {
                        content: csv,
                        filename: 'prospects.csv',
                        type: 'text/csv',
                        disposition: 'attachment'
                    },
                ],
            };
            await sgMail.send(msg);

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
