import { response } from "../../lib/response-lib.cjs";
import { fileTypes, sandboxFileTypes } from "../../lib/carbone-lib.js";

/**
 * filetypes - output the supported file types for the Carbone JS library
 * @param event
 * @param context
 * @returns {Promise<void>}
 */
export async function handler (event, context) {
    if (process.env.CARBONE_KEY.includes('test')) {
        return response.success({ dictionary: sandboxFileTypes });
    }
    return response.success({ dictionary: fileTypes });
}
