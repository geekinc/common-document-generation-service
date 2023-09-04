export default {
    success: (body) => buildResponse(200, body),
    successtext: (body) => buildTextResponse(200, body),
    successcsv: (body) => buildRawResponse(200, body, {"Content-Type": "text/csv"}),
    failure: (body) => buildResponse(500, body),
    badrequest: (body) => buildResponse(400, body),
    unauthorized: (body) => buildResponse(401, body),
    notfound: (body) => buildResponse(404, body),
    redirect: (location) => buildResponse(302, undefined, {Location: location})
};

function buildResponse(statusCode, body, headers = {}) {
    return {
        statusCode: statusCode,
        headers: {
            ...headers,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(body)
    };
}

function buildRawResponse(statusCode, body, headers = {}) {
    return {
        statusCode: statusCode,
        headers: {
            ...headers,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: body
    };
}

function buildTextResponse(statusCode, body, headers = {}) {
    let response = {
        response: body
    };
    return {
        statusCode: statusCode,
        headers: {
            ...headers,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(response)
    };
}
