import { response } from "../../lib/response-lib.cjs";
import { logger } from "../../lib/logger-lib.js";
import Users from '../../lib/user-lib.js';
import * as jose from 'jose';
import bcrypt from 'bcrypt';

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
            token: ""
        }

        try {
            let result = await bcrypt.compare(password, user.password)

            if (result) {
                const secret = new TextEncoder().encode(process.env.APP_SECRET);

                localUser.token = await new jose
                    .SignJWT(localUser)
                    .setExpirationTime('30d')
                    .setProtectedHeader({ alg: "HS256" })
                    .sign(secret);

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
