import { verify } from "../../lib/keycloak-lib.js";
import Users from '../../lib/user-lib.js';


const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};


export const handler = async(event, context, callback) => {
    let verified = false;
    let result;

    // Get Token
    if (typeof event.authorizationToken === 'undefined') {
        callback('Unauthorized');
    }

    if (event.authorizationToken) {
        const split = event.authorizationToken.split('Bearer');
        if (split.length !== 2) {
            callback('Unauthorized');
        }
    } else {
        callback('Unauthorized');
    }

    try {
        const token = event.authorizationToken.split('Bearer')[1].trim()
        result = await verify(token);
        if (result.status === 'success') {
            verified = true;
        }
    } catch (e) {
        callback(false, generatePolicy('invalid', 'Deny', event.methodArn));
    }

    if (verified) {
        let user = await Users.getUserByUsername(result.data.preferred_username);
        callback(null, generatePolicy(user[0].id, 'Allow', event.methodArn));
    } else {
        callback(false, generatePolicy('invalid', 'Deny', event.methodArn));
    }
};
