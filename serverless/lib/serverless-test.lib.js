function Request() {
    this.body = {};
    this.params = {};
    this.query = {};
    this.headers = {};
    this.user = {};
    this.userId = "";
    this.header = function (name) {
        return this.headers[name];
    };
}

function Response() {
    this.statusCode = 200;
    this.data = "";
    this.json = function (data) {
        this.data = JSON.stringify(data);
        return this;
    };
    this.send = function (data) {
        this.data = data;
        return this;
    };
    this.status = function(code) {
        this.statusCode = code;
        return this;
    };
}

module.exports = {
    Request: Request,
    Response: Response
};
