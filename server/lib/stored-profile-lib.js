const mysql = require('serverless-mysql')({
    library: require('mysql2'),
    config: {
        host     : process.env.rds_host,
        database : process.env.rds_database,
        user     : process.env.rds_user,
        password : process.env.rds_password,
        charset  : 'utf8mb4_unicode_ci'
    }
});

export async function getStoredProfiles(customer) {
    let results;
    try {
        // Read data from table
        results = await mysql.query(
            "SELECT * FROM `stored-profiles` WHERE customer = ?",
            [
                customer
            ]);
    } catch (error) {
        console.log(error);
    }

    return results;
}

export function getIndustryIDsFromNames(industryArray) {
    let industries = require('../data/industries.json');

    let industryIDs = [];
    for (let x = 0; x < industryArray.length; x++) {
        for (let y = 0; y < industries.length; y++) {
            if (industryArray[x].toString().toLowerCase() === industries[y].name.toString().toLowerCase()) {
                industryIDs.push(industries[y].id);
            }
        }
    }

    return industryIDs;
}
