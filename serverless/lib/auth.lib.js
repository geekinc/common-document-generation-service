const njwt = require("njwt");
const Users = require("./user.lib.js");
const APP_SECRET = process.env.APP_SECRET

class Auth {

    /**
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
    static authMiddleware = async (req, res, next) => {
        let user;
        let token = req.header('Authorization');
        if (!token) {
            return next();
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        try {
            const decoded = Auth.verifyToken(token);
            const { userId } = decoded;
            user = await Users.getUserById(userId);
            if (user) {
                req.userId = userId;
            } else {
                return next();
            }
        } catch (e) {
            return next();
        }
        next();
    };

    /**
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
    static authenticated = (req, res, next) => {
        if (req.userId) {
            return next();
        }

        res.status(401);
        res.json({ error: 'User not authenticated' });
    }

    /**
     * @param {Object} res
     */
    static returnInvalidCredentials = async (res) => {
        res.status(401);
        return res.json(
            {
                error: 'Invalid username or password',
                id: 0,
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                role: "",
                token: ""
            }
        );
    }


    /**
     * @param {Object} tokenData
     * @returns {string} token
     */
    static encodeToken = (tokenData) => {
        return njwt.create(tokenData, APP_SECRET).compact();
    }

    /**
     * @param {string} token
     * @returns {Object} tokenData
     * @returns {string} tokenData.userId
     */
    static verifyToken = (token) => {
        return njwt.verify(token, APP_SECRET, function(err, verifiedJwt) {
            if (err) {
                throw err;
            }
            return verifiedJwt;
        }).setExpiration(new Date().getTime() + 604800000).body;
    }

    /**
     * @param {string} token
     * @returns {Object} tokenData
     * @returns {string} tokenData.userId
     */
    static isAdmin = (token) => {
        try {
            let jwt = this.verifyToken(token);
            return jwt.role.toString().toLowerCase() === 'admin';  // return true if the user is an admin
        } catch (e) {
            return false;
        }
    }

    /**
     * @param {string} token
     * @returns {string} tokenData.userId
     */
    static getUserIdFromToken = (token) => {
        const output = njwt.verify(token, APP_SECRET).setExpiration(new Date().getTime() + 604800000).body;
        return output['userId'];
    }

    /**
     * @param {string} token
     * @returns {string} tokenData.role
     */
    static getUserRoleFromToken = (token) => {
        const output = njwt.verify(token, APP_SECRET).setExpiration(new Date().getTime() + 604800000).body;
        return output['role'];
    }
}

module.exports = Auth;
