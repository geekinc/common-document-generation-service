import axios from 'axios';
import { createRemoteJWKSet, importJWK, jwtVerify } from "jose";

const authenticate = async (username, password) => {
    return await axios.post(
        process.env.KEYCLOAK_URL + '/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token',
        {
                client_id: encodeURIComponent(process.env.KEYCLOAK_CLIENT_ID),
                client_secret: encodeURIComponent(process.env.KEYCLOAK_CLIENT_SECRET),
                grant_type: 'password',
                scope: 'openid',
                username: encodeURIComponent(username),
                password: encodeURIComponent(password)
            }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(function (response) {
            return { status: 'success', data: response.data };
        })
        .catch(function (error) {
            return { status: 'error', data: error.response.data };
        });
};


// Huge help understanding the process of verifying a keycloak token from this site:
// https://www.janua.fr/keycloak-access-token-verification-example/
const verify = async (token) => {
    const rsaPublicKeys = await createRemoteJWKSet(
        new URL(process.env.KEYCLOAK_URL + '/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/certs')
    );

    try {
        const { payload, protectedHeader } = await jwtVerify( token, rsaPublicKeys);
        return { status: 'success', data: payload };
    } catch (e) {
        return { status: 'error', data: 'Invalid token' };
    }
}

export {
    authenticate,
    verify
};
