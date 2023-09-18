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

export async function getStoredProfile(profile_id) {
    let results;
    try {
        // Read data from table
        results = await mysql.query(
            "SELECT * FROM `stored-profiles` WHERE id = ?",
            [
                profile_id
            ]);
    } catch (error) {
        console.log(error);
    }

    return results;
}

export async function getStoredProfilePageNumber(profile_id) {
    let results;
    try {
        // Read data from table
        results = await mysql.query(
            "SELECT hydration_page_number FROM `stored-profiles` WHERE id = ?",
            [
                profile_id
            ]);
    } catch (error) {
        console.log(error);
    }

    return results[0].hydration_page_number | 1;
}

export async function incrementStoredProfilePageNumber(profile_id) {
    let results;
    try {
        // Read data from table
        results = await mysql.query(
            "SELECT hydration_page_number FROM `stored-profiles` WHERE id = ?",
            [
                profile_id
            ]);

        let hydration_page_number = results[0].hydration_page_number + 1;

        results = await mysql.query(
            "UPDATE `stored-profiles` SET hydration_page_number = ? WHERE id = ?",
            [
                hydration_page_number,
                profile_id
            ]);
    } catch (error) {
        console.log(error);
    }

    return results;
}
