/**
 * @fileoverview Controller for the armpit route
 */

import { response } from "../lib/response-lib.cjs";
import { dao } from "../lib/dao-mysql-lib.cjs";

/**
 * get users
 * @param event
 * @param context
 * @returns {Promise<void>}
 */
async function get_users (event, context) {
    try {
        const users = await dao.run('SELECT * FROM users', []);
        return response.success(users);
    } catch (e) {
        /* istanbul ignore next */   // This will only be thrown if the table doesn't exist - which should never happen
        return response.failure(e);
    }
}

/**
 * query
 * @param statement
 * @param parameters
 * @returns {Promise<*>}
 */
async function query (statement, parameters) {
    try {
        const users = await dao.run(statement, parameters);
        return response.success(users);
    } catch (e) {
        return response.failure(e);
    }
}


// Exports
export const main = {
    get_users: (event, context) => get_users(event, context),
    query: (statement, parameters) => query(statement, parameters)
};
