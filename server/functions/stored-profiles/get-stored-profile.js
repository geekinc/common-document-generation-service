import response from "../../lib/response-lib";
import { logger } from '../../lib/logger-lib';
import { getStoredProfiles } from '../../lib/stored-profile-lib';

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

        let results = getStoredProfiles(customer);

        return response.success(results);

    } catch (exception) {
        return response.failure();
    }
}
