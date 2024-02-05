import { response } from "../../lib/response-lib.cjs";
import { logger } from "../../lib/logger-lib.js";
import Users from '../../lib/user-lib.js';
import * as jose from 'jose';
import bcrypt from 'bcrypt';
import { authenticate } from '../../lib/keycloak-lib.js';

/***********************************************************************************************************************
 * Security Requirements:
 * No security requirements - this is the opening call allowing a user to login
 ***********************************************************************************************************************/

export async function main(event, context) {

    const { username, password } = JSON.parse(event.body);
    let user;
    try {
        user = await Users.getUserByUsername(username)
        user = user[0];
    } catch (exception) {
        return response.failure({error: 'Invalid credentials'});
    }

    if (user && user.enabled) {
        let localUser = {
            id: user.id,
            username: username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            token: "",
            refreshToken: ""
        }

        try {

            let result = await authenticate(username, password);

            if (result.status === 'success') {

                localUser.token = result.data.access_token;
                localUser.refreshToken = result.data.refresh_token;

                return response.success(localUser);
            } else {
                return response.failure({error: 'Invalid credentials'});
            }
        } catch (exception) {
            await logger.error(exception);
            return response.failure({error: 'Invalid credentials'});
        }

    } else {
        return response.failure({error: 'User has been disabled'});
    }

}
