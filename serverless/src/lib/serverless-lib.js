
const Request = class {
    body = {};
    pathParams = {};
    queryStringParameters = {};
    headers = {};
    httpMethod = "GET";

    constructor() {
        // no need for a constructor
    }

    header(name) {
        return this.headers[name];
    }
}

const Response = class {
    statusCode = 200;
    data = {};

    json (data) {
        try {
            this.data = JSON.parse(data);
        } catch (e) {
            this.data = {error: e.message};
        }
        return this;
    };

    send(data) {
        this.data = data;
        return this;
    };

    status(code) {
        this.statusCode = code;
        return this;
    };

    constructor() {
        // no need for a constructor
    }

}


const Event = class {
    body = {};
    pathParams = {};
    queryStringParameters = {};
    headers = {};
    httpMethod = "GET";

    constructor() {
        // no need for a constructor
    }

    header(name) {
        return this.headers[name];
    }
}


// This object is pure conjecture right now.  This *may* need to be updated
const Context = class {
    functionName = "test";

    constructor() {
        // no need for a constructor
    }
}

module.exports = {
    Request: Request,
    Response: Response,
    Event: Event,
    Context: Context
};
