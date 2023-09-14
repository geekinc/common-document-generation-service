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

            // Write data to database
            // NOTE: using insert ignore means that if the record already exists, it will not be inserted again
            // - i.e. the data will NOT update to the latest version (this is fine for the initial version of the app)
            // - TODO: review this to add more robust upsert functionality
            let results = await mysql.query(
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
                    uuidv4(),
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
