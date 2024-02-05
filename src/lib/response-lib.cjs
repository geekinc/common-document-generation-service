function success(body, json=true) {
    if (json) return jsonBuildResponse(200, body);
    else return rawBuildResponse(200, body);
}

function failure(body, json=true) {
    if (json) return jsonBuildResponse(500, body);
    else return rawBuildResponse(500, body);
}

const response = {
    success: (body) => jsonBuildResponse(200, body),
    failure: (body) => jsonBuildResponse(500, body),
    bad_request: (body) => jsonBuildResponse(400, body),
    unauthorized: (body) => jsonBuildResponse(401, body),
    not_found: (body) => jsonBuildResponse(404, body),
    redirect: (location) => jsonBuildResponse(302, undefined, {Location: location}),
    svg_success: (body) => svgBuildResponse(200, body),
    svg_failure: (body) => svgBuildResponse(500, body),
    raw_success: (body) => rawBuildResponse(200, body),
    raw_failure: (body) => rawBuildResponse(500, body),
    raw_bad_request: (body) => rawBuildResponse(400, body),
    raw_unauthorized: (body) => rawBuildResponse(401, body),
    raw_not_found: (body) => rawBuildResponse(404, body),
};

function jsonBuildResponse(statusCode, body, headers = {}) {
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
function rawBuildResponse(statusCode, body, headers = {}) {
    return {
        statusCode: statusCode,
        headers: {
            ...headers,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "text/html"
        },
        body: body
    };
}
function svgBuildResponse(statusCode, body, headers = {}) {
    return {
        statusCode: statusCode,
        headers: {
            ...headers,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "image/svg+xml"
        },
        body: body
    };
}

module.exports = {
    success,
    failure,
    response
};
