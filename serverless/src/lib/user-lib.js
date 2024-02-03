import { dao } from "./dao-mysql-lib.cjs";
import { logger } from "./logger-lib.js";
import * as jose from "jose";
import bcrypt from "bcrypt";
const saltRounds = parseInt(process.env.SALT_ROUNDS);

export default class Users {

    static async getUserByUsername(username)  {
        try {
            return await dao.run("SELECT * FROM users WHERE username = ?", [username]);
        } catch (e) {
            await logger.error(e);
            throw new Error('Error getting user');
        }
    }

    static getUserById = async (id) => {
        return await dao.run('SELECT * FROM users WHERE id = ?', [id]);
    }

    static getAllUsers = async () => {
        return await dao.run('SELECT * FROM users', []);
    }

    static getAllUsersCount = async () => {
        return await dao.run('SELECT count(*) as usersCount FROM users', []);
    }

    static createUser = async (username, password) => {
        // Check parameters
        if (!username || !password) {
            throw new Error('Missing parameters');
        }

        const hash = await bcrypt.hash(password, saltRounds);
        return await dao.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    }

    static updateUser = async (id, fields) => {
        // Check parameters
        if (!id) {
            throw new Error('Missing id parameter');
        }

        // Fetch the data from the fields object
        const { username, password, firstname, lastname } = fields;

        // if the optional fields are present, execute the query
        if (username) {
            await dao.run('UPDATE users SET username = ? WHERE id = ?', [username, id]);
        }

        if (password) {
            const hash = await bcrypt.hash(password, saltRounds);
            await dao.run('UPDATE users SET password = ? WHERE id = ?', [hash, id]);
        }

        if (firstname) {
            await dao.run('UPDATE users SET firstname = ? WHERE id = ?', [firstname, id]);
        }

        if (lastname) {
            await dao.run('UPDATE users SET lastname = ? WHERE id = ?', [lastname, id]);
        }

        return await dao.run('SELECT * FROM users WHERE id = ?', [id]);
    }

    static deleteUser = async (id) => {
        return await dao.run('DELETE FROM users WHERE id = ?', [id]);
    }

    static setUserRole = async (id, role, token) => {
        // Check that the token is valid and from an ADMIN
        const secret = new TextEncoder().encode(process.env.APP_SECRET);
        const output = await jose.jwtVerify(token.trim(), secret);
        const adminId = output.payload['userId'] ? output.payload['userId'] : null;
        const adminRole = output.payload['role'] ? output.payload['role'] : null;

        if (!adminId || (adminRole !== 'ADMIN')) {
            await logger.error('Unauthorized request in user-lib.setUserRole - Requester ID:' + id);
            throw new Error('Unauthorized');
        }

        return await dao.run('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    }
}
