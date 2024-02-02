import { response } from "../../lib/response-lib.cjs";

/**
 * armpitCount - a very simple demonstration of an endpoint that takes a parameter
 * @param event
 * @param context
 * @returns {Promise<void>}
 */
export async function armpitCount (event, context) {
    if (!event || !event.pathParameters || !("count" in event.pathParameters)) {
        return response.raw_failure('Missing count parameter');
    }
    if (event.pathParameters.count < 0) {
        return response.raw_bad_request('Count must be a positive integer');
    } else {
        return response.raw_success(event.pathParameters.count);
    }
}
