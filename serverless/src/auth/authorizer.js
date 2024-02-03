import * as jose from 'jose';

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
    let result;
    let verified = false;

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
        const secret = new TextEncoder().encode(process.env.APP_SECRET);
        result = await jose.jwtVerify(event.authorizationToken.split('Bearer')[1].trim(), secret);
        verified = true;
    } catch (e) {
        verified = false;
        // console.error(e);
    }

    if (verified) {
        callback(null, generatePolicy(result.payload.id, 'Allow', event.methodArn));
    } else {
        callback(false, generatePolicy('invalid', 'Deny', event.methodArn));
    }
};
