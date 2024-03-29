import { dao } from "./dao-mysql-lib.cjs";
import { logger } from "./logger-lib.js";
import * as jose from "jose";
import bcrypt from "bcrypt";
const saltRounds = parseInt(process.env.SALT_ROUNDS);

export default class Users {

    static async getUserByUsername(username)  {
        try {
            return await dao.run("SELECT * FROM user WHERE username = ?", [username]);
        } catch (e) /* istanbul ignore next */ {
            await logger.error(e);
            throw new Error('Error getting user');
        }
    }

    static getUserById = async (id) => {
        return await dao.run('SELECT * FROM user WHERE id = ?', [id]);
    }

    static getAllUsers = async () => {
        return await dao.run('SELECT * FROM user', []);
    }

    static getAllUsersCount = async () => {
        return await dao.run('SELECT count(*) as usersCount FROM user', []);
    }

    static createUser = async (username, password) => {
        // Check parameters
        if (!username || !password) {
            throw new Error('Missing parameters');
        }

        const hash = await bcrypt.hash(password, saltRounds);
        return await dao.run('INSERT INTO user (username, password) VALUES (?, ?)', [username, hash]);
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
            await dao.run('UPDATE user SET username = ? WHERE id = ?', [username, id]);
        }

        if (password) {
            const hash = await bcrypt.hash(password, saltRounds);
            await dao.run('UPDATE user SET password = ? WHERE id = ?', [hash, id]);
        }

        if (firstname) {
            await dao.run('UPDATE user SET firstname = ? WHERE id = ?', [firstname, id]);
        }

        if (lastname) {
            await dao.run('UPDATE user SET lastname = ? WHERE id = ?', [lastname, id]);
        }

        return await dao.run('SELECT * FROM user WHERE id = ?', [id]);
    }

    static deleteUser = async (id) => {
        return await dao.run('DELETE FROM user WHERE id = ?', [id]);
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

        return await dao.run('UPDATE user SET role = ? WHERE id = ?', [role, id]);
    }
}
