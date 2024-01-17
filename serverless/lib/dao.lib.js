const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database( path.join(__dirname, '..', 'sqlite.db'));

class DAO {

    static all(stmt, params) {
        return new Promise((res, rej) => {
            db.all(stmt, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        })
    }

    static async get(stmt, params) {
        return new Promise( (res, rej) => {
             db.get(stmt, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        })
    }

    static run(stmt, params) {
        return new Promise((res, rej) => {
            db.run(stmt, params, (error, result) => {
                if (error) {
                    return rej(error.message);
                }
                return res(result);
            });
        })
    }
}

module.exports = DAO;
