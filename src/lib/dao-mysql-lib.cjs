const mysql = require('serverless-mysql')({
    config: {
        host     : process.env.MYSQL_HOST,
        database : process.env.MYSQL_DATABASE,
        user     : process.env.MYSQL_USERNAME,
        password : process.env.MYSQL_PASSWORD,
    },
    manageConns: (process.env.STAGE !== 'dev')
});

class DAO {
    static async run(stmt, params) {
        let results;
        try {
            results = await mysql.query(stmt, params);
        } catch (e) {
            mysql.quit();
            throw e;
        }
        mysql.quit();
        return results;
    }
}

const dao = {
    run: (statement, parameters) => DAO.run(statement, parameters),
};

module.exports = {
    dao
};
