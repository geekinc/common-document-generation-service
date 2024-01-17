const axios = require("axios");

const apolloSearch =  async (req, res) => {
    let body = req.body;

    // If body is not an object, try to parse it as JSON
    if (typeof body !== 'object') {
        try {
            body = JSON.parse(body);
        } catch (error) {
            res.status(400).send(JSON.stringify(
                {
                    "is_logged_in": false,
                    "message": "Invalid request body"
                }
            ));
            return;
        }
    }

    try {
        // Pull parameters from body
        const { email, password } = body;

        // Make sure all parameters are present
        if (!email || !password) {
            res.status(400).send(JSON.stringify(
                {
                    "is_logged_in": false,
                    "message": "Missing required parameter"
                }
            ));
            return;
        }

        // Make request to Apollo API
        const response = await axios.get(`https://app.apollo.io/api/v1/auth/login?email=${email}&password=${password}`);
        res.status(200).send(response.data);
    } catch (error) {
        res.status(500).send(JSON.stringify(
            {
                "is_logged_in": false,
                "message": "There was an error processing your request",
                "error": error
            }
        ));
    }
}

module.exports = {
    apolloSearch: apolloSearch
};
