import response from "../../lib/response-lib";
import { logger } from '../../lib/logger-lib';
import { v4 as uuidv4 } from 'uuid';

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

    logger.info(JSON.stringify(event, undefined, 2));
    let var_record = [];

    try {
        //  parse data from APIs
        if (event.body) {
            logger.info('info: API CALL');
            var_record = JSON.parse(atob(event.body));
        }

        //  parse data from SQS
        if (event.Records !== undefined) {
            logger.info('info: SQS QUEUE');
            var_record = JSON.parse(event.Records[0].body);
        }
    } catch (exception) {
        var_record = JSON.parse(event.body);
    }

    try{
        // insert the profile into the table
        // stored-profile description
        /*
        Field              |Type           |Null|Key|Default|Extra|
        -------------------+---------------+----+---+-------+-----+
        id                 |varchar(100)   |NO  |PRI|       |     |
        customer           |varchar(255)   |YES |   |       |     |
        description        |varchar(255)   |YES |   |       |     |
        keyword            |varchar(255)   |YES |   |       |     |
        state              |varchar(100)   |YES |   |       |     |
        job_title          |text           |YES |   |       |     |
        location           |text           |YES |   |       |     |
        industry           |text           |YES |   |       |     |
        number_of_employees|text           |YES |   |       |     |
        company_revenue_min|bigint unsigned|YES |   |       |     |
        company_revenue_max|bigint unsigned|YES |   |       |     |
        prospect_tag       |varchar(255)   |YES |   |       |     |
        hydration_frequency|bigint         |YES |   |       |     |
        hydration_period   |varchar(100)   |YES |   |       |     |
         */

        let results = await mysql.query(
            ` insert into \`stored-profiles\`
                (id,
                 customer,
                 \`description\`, 
                 \`keyword\`,
                 \`state\`,
                 job_title, 
                 location, 
                 industry, 
                 number_of_employees, 
                 company_revenue_min, 
                 company_revenue_max, 
                 prospect_tag, 
                 hydration_frequency, 
                 hydration_period )
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            uuidv4(),
            var_record.customer,
            var_record.description,
            var_record.keyword,
            var_record.state,
            var_record.job_title.join("|"),
            var_record.location.join("|"),
            var_record.industry.join("|"),
            var_record.number_of_employees.join("|"),
            var_record.company_revenue_min,
            var_record.company_revenue_max,
            var_record.prospect_tag,
            var_record.hydration_frequency,
            var_record.hydration_period
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
