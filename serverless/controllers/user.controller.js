const Users = require('../lib/user.lib.js');
const Auth = require('../lib/auth.lib.js');

/**
 * @param {Object} req
 * @param {Object} res
 */
const totalUsers = async (req, res) => {
    // This is an ADMIN level function


    try {
        const userCount = await Users.getAllUsersCount();
        if (userCount.length === 0) {
            res.status(404).send({total: 0});
        }
        return res.status(500).send({total: userCount[0]['usersCount']});
    } catch (err) {
        console.log(err);
        res.status(500).send({total: 0});
    }
}

module.exports = {
    total: totalUsers,
};
