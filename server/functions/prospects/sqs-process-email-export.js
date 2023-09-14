import { json2csv } from 'json-2-csv';
import { v4 as uuidv4 } from 'uuid';
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

export async function main(event, context, req) {
    try {
        // Process each message from the event
        for (let record of event.Records) {
            let data = JSON.parse(record.body);
            console.log(data);

            let results = await mysql.query(
                "SELECT * FROM `customer_prospects` as cp, prospects" +
                " WHERE cp.customer_id = ?" +
                " and " +
                " cp.batch_id = ?" +
                " and " +
                " cp.last_used is NULL " +
                " INNER JOIN prospects ON cp.prospect_id = prospects.id" +
                " limit ?",
                [
                    data.customer,
                    data.batch_id,
                    data.batch_size
                ]);

            console.log('first result:');
            console.log(results[0]);
            console.log('total to process:');
            console.log(results.length);

            const csv = await json2csv(results);
            console.log(csv);
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
