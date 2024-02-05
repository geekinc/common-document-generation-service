import axios from 'axios';
import { createRemoteJWKSet, importJWK, jwtVerify } from "jose";
import * as jose from "jose";

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
    let rsaPublicKey;

    try {
        const keys = await axios.get(process.env.KEYCLOAK_URL + '/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/certs', {})
        rsaPublicKey = await importJWK(keys.data.keys[0], 'RS256');
    } catch (e) {
        return { status: 'error', data: 'Error getting public key' };
    }

    try {
        const { payload, protectedHeader } = await jwtVerify( token, rsaPublicKey );
        return { status: 'success', data: payload };
    } catch (e) {
        return { status: 'error', data: 'Invalid token' };
    }
}

export {
    authenticate,
    verify
};
