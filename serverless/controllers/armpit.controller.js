/**
 * @fileoverview Controller for the armpit route
 */


/**
 * armpit - a very simple demonstration of an endpoint
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const armpit = async (req, res) => {
    res.status(200).send('oxter');  // set both the status code and the response body
}

/**
 * armpitCount - a very simple demonstration of an endpoint that takes a parameter
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const armpitCount = async (req, res) => {
    try {
        if (!req || !req.params || !req.params.count) {
            throw Error('There was an error processing your request');
        }
        if (req.params.count < 0) {
            res.status(400).send('Count must be a positive integer');
        } else {
            res.status(200).send(req.params.count);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    armpit: armpit,
    armpitCount: armpitCount
};
