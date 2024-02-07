import { response } from "../../lib/response-lib.cjs";
import { fileTypes } from "../../lib/carbone-lib.js";

/**
 * filetypes - output the supported file types for the Carbone JS library
 * @param event
 * @param context
 * @returns {Promise<void>}
 */
export async function handler (event, context) {
    if (fileTypes instanceof Object) {
        return response.success({ dictionary: fileTypes });
    } else {
       return response.failure({ detail: 'Unable to get file types dictionary' });
    }
}
