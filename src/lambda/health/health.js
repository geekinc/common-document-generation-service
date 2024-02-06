import { response } from "../../lib/response-lib.cjs";

/**
 * health - a very simple demonstration of an endpoint
 * @param event
 * @param context
 * @returns {Promise<void>}
 */
export async function handler (event, context) {
    // Return a 200 response with a (mostly) empty body
    // This indicates the service is up
    return response.raw_success(' ');   // If we returned an empty body, the response would status 204 No Content
}
