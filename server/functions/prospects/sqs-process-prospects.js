import util from "util";
import {v4 as uuidv4} from "uuid";
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
            let prospect = JSON.parse(record.body);
            console.log(util.inspect(prospect, {showHidden: false, depth: null, colors: false, maxArrayLength: 500}));

            // Use email as an index to determine if we insert or update
            let results = await mysql.query(
                "SELECT * FROM `prospects` WHERE email = ?",
                [
                    prospect.email
                ]);

            let prospect_id = '';
            if (results.length > 0) {
                prospect_id = results[0].id;
            } else {
                prospect_id = uuidv4();
            }
            if (results.length > 0) {
                await mysql.query(
                    ` update \`prospects\`
                   set first_name = ?,
                       last_name = ?,
                       email = ?,
                       title = ?,
                       linkedin_url = ?,
                       city = ?,
                       \`state\` = ?,
                       country = ?,
                       json_data = ?
                   where email = ?`,
                    [
                        prospect.first_name,
                        prospect.last_name,
                        prospect.email,
                        prospect.title,
                        prospect.linkedin_url,
                        prospect.city,
                        prospect.state,
                        prospect.country,
                        JSON.stringify(prospect),
                        prospect.email
                    ]);
                    console.log('Updated prospect: ' + prospect.email);
            } else {
                await mysql.query(
                    ` insert ignore into \`prospects\`
               ( id,
                 first_name,
                 last_name, 
                 email,
                 title, 
                 linkedin_url, 
                 city, 
                 \`state\`, 
                 country, 
                 json_data 
               )
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        prospect_id,
                        prospect.first_name,
                        prospect.last_name,
                        prospect.email,
                        prospect.title,
                        prospect.linkedin_url,
                        prospect.city,
                        prospect.state,
                        prospect.country,
                        JSON.stringify(prospect)
                    ]);
                console.log('Inserted prospect: ' + prospect.email);
            }

            // Assign the prospect to a customer (if not already assigned)
            // This will be used by a later lambda to process the data into a CSV or API call or whatever
            if (prospect.batch_count_number < prospect.batch_count_total) {
                await mysql.query(
                    ` insert ignore into \`customer_prospects\`
                   ( 
                     customer_id,
                     prospect_id,
                     usage_type,
                     batch_id,
                     last_used
                   )
                    values (?, ?, ?, ?, ?)`,
                    [
                        prospect.customer,
                        prospect_id,
                        prospect.usage_type,
                        prospect.batch_id,
                        null
                    ]);
            }
        }
    } catch (e) {
        console.log(util.inspect(e, {showHidden: false, depth: null, colors: false, maxArrayLength: 500}));
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
