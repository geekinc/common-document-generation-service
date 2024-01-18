const DAO = require('./DAO.lib.js');
const bcrypt = require('bcrypt');
const njwt = require("njwt");
const APP_SECRET = process.env.APP_SECRET
const saltRounds = 10;

class Users {

    static getUserByUsername = async (username) => {
        return await DAO.get("SELECT * FROM users WHERE username = ?", [username]);
    }

    static getUserById = async (id) => {
        return await DAO.get('SELECT * FROM users WHERE id = ?', [id]);
    }

    static getAllUsers = async () => {
        return await DAO.all('SELECT * FROM users');
    }

    static createUser = async (username, password) => {
        // Check parameters
        if (!username || !password) {
            throw new Error('Missing parameters');
        }

        const hash = await bcrypt.hash(password, saltRounds);
        return await DAO.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    }

    static updateUser = async (id, username, password) => {
        // Check parameters
        if (!id || !username || !password) {
            throw new Error('Missing parameters');
        }

        const hash = await bcrypt.hash(password, saltRounds);
        return await DAO.run('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, hash, id]);
    }

    static deleteUser = async (id) => {
        return await DAO.run('DELETE FROM users WHERE id = ?', [id]);
    }

    static setUserRole = async (id, role, token) => {
        // Check that the token is valid and from an ADMIN
        const output = njwt.verify(token, APP_SECRET).setExpiration(new Date().getTime() + 604800000).body;
        const adminId = output['userId'];
        const adminRole = output['role'];

        if (!adminId || adminRole !== 'ADMIN') {
            throw new Error('Unauthorized');
        }

        return await DAO.run('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }
}

module.exports = Users;
