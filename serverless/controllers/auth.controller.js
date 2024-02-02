const Auth = require('../lib/auth.lib.js');
const Users = require('../lib/user.lib.js');
const bcrypt = require('bcrypt');


/**
 * @param {Object} req
 * @param {Object} res
 */
const logout = async (req, res) => {
  res.status(200);  // logged out successfully
  let localUser = {
    id: 0,
    error: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "",
    token: ""
  }
  return res.json(localUser);
}

/**
 * @param {Object} req
 * @param {Object} res
 */
const login = async (req, res) => {

    const { username, password, role } = req.body;
    const user = await Users.getUserByUsername(username)

    if (typeof user !== "undefined") {
        let localUser = {
            id: 1,
            username: username,
            password: password,
            firstName: username.toUpperCase(),
            lastName: "",
            profilePic: "",
            role: role,
            token: ""
        }

        let result = await bcrypt.compare(password, user.password)
        if (result) {
            const tokenData = {
                userId: user.id,
                role: user.role
            };
            localUser.token = Auth.encodeToken(tokenData);
            return res.json(localUser);
        } else {
            return Auth.returnInvalidCredentials(res);
        }

    } else {
        return await Auth.returnInvalidCredentials(res)
    }
}

module.exports = {
    login: login,
    logout: logout,
    // getUserFromToken: getUserFromToken
};
