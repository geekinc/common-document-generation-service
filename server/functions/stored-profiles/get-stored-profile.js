import response from "../../lib/response-lib";
import { logger } from '../../lib/logger-lib';

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

/***********************************************************************************************************************
 * Security Requirements:
 * None
 ***********************************************************************************************************************/

export async function main(event, context) {
    let customer = event.pathParameters.customer || null;

    if (!customer) {
        return response.failure("Missing customer parameter");
    }

    logger.info(JSON.stringify(event, undefined, 2));
    let var_method;
    let var_record = [];

    try {
        //  parse data from APIs
        if (event.body) {
            var_method = 'API';
            logger.info('info: API CALL');
            var_record = JSON.parse(event.body);
        }

        // Read data from table
        let results = await mysql.query(
            "SELECT * FROM `stored-profiles` WHERE customer = ?",
        [
            customer
        ]);

        return response.success(results);

    } catch (exception) {
        await logger.error(exception, event, mysql);
        return response.failure();
    } finally {
        //  close mysql connection
        await mysql.end();
    }
}
