/**
 * @fileoverview Controller for the armpit route
 */

import { response } from "../../lib/response-lib.cjs";

/**
 * armpit - a very simple demonstration of an endpoint
 * @param event
 * @param context
 * @returns {Promise<void>}
 */
export async function armpit (event, context) {
    return response.raw_success('oxter');
}
