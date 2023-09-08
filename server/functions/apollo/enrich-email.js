import response from "../../lib/response-lib";
import { json2csv } from 'json-2-csv';
import { parse_host } from 'tld-extract';
const axios = require('axios');

const keys = [
    "mDSuNyxv-x5wNgRnyKei5g",
    "gs_ytoBmZht7mm8fWN_IoQ",
    "jq3u7hN8I69TEe0J7eRwEQ",
//    "G2OFJe7sBsI3ZALHLv4R2g",  // Dead api key
    "wJTpegcDY2mTzi8l2eLKAw"
];
let currentKey = 0;
let API_KEY = process.env.API_KEY || keys[currentKey];
const asyncWait = ms => new Promise(resolve => setTimeout(resolve, ms));

/***********************************************************************************************************************
 * Security Requirements:
 * None - this is wide open
 ***********************************************************************************************************************/

export async function main(event, context) {
    let input = JSON.parse(event.body);
    let emails = [];
    let enriched = [];

    // Make sure we have an email address
    if (!input.email) {
        return response.failure('Missing email address');
    }

    if (!(input.email.constructor === Array)) {
        emails = [input.email];
    } else {
        if (input.email.length > 500) {
            return response.failure('Too many email addresses');
        }
        emails = input.email;
    }

    for (let x = 0; x < emails.length; x++) {
        API_KEY = keys[currentKey];
        currentKey++;
        if (currentKey === keys.length) {
            currentKey = 0;
        }
        if (emails[x].toString().includes('|')) {
            console.log(emails[x].toString().split('|')[0]);
        }

        const address = emails[x].toString().toLowerCase().split('@').pop();
        const domain = parse_host(address).domain;

        const skippedDomains = [
            "gmail.com",
            "yahoo.com",
            "hotmail.com",
            "aol.com",
            "outlook.com",
            "icloud.com",
            "me.com",
            "msn.com",
            "live.com",
            "mac.com",
            "comcast.net",
            "sbcglobal.net",
            "verizon.net",
            "att.net",
            "bellsouth.net",
            "cox.net",
            "earthlink.net",
            "juno.com",
            "optonline.net",
            "rocketmail.com"
        ];
        if (skippedDomains.includes(domain)) {
            console.log("\t>>> Skipping");
            continue;
        }

        let request = {
            "api_key": API_KEY,
            "q_keywords" : emails[x].toString().toLowerCase(),
            "per_page": 10,
            "page": 1
        };

        let result;
        try {
            result = await axios.post('https://api.apollo.io/v1/mixed_people/search', request, {timeout: 5000});
        } catch (exception) {
            result.status = 500;
        }
        if (result.status !== 200) {
            return response.failure('Error calling Apollo API');
        }

        if (result.data && result.data.contacts.length > 0) {
            enriched.push({
                "email": emails[x].toString().toLowerCase(),
                "enriched": true,
                "data": result.data.contacts[0] // Fetch the first result
            });
            console.log("\t>>> Found");
        }
        else {
            if (result.data && (result.data.people.length > 0 || result.data.contacts.length > 0)) {
                if (result.data.people.length > 0) {
                    enriched.push({
                        "email": emails[x].toString().toLowerCase(),
                        "enriched": true,
                        "data": result.data.people[0] // Fetch the first result
                    });
                }
                if (result.data.contacts.length > 0) {
                    enriched.push({
                        "email": emails[x].toString().toLowerCase(),
                        "enriched": true,
                        "data": result.data.contacts[0] // Fetch the first result
                    });
                }
                console.log("\t>>> Found");
            } else {

                // Determine the correct domain to use to search
                // Often people will have old email addresses that are no longer valid, this helps us find the correct domain
                let redirectDomain = domain;
                await axios.get('http://' + domain, {timeout: 5000}).then(function(response) {
                    redirectDomain = response.request.res.responseUrl;
                    console.log("\t>>> Redirected to " + redirectDomain);  // we don't need to trim the protocol as the system accepts http://domain.com or domain.com
                }).catch(function(no200){
                    console.error("\t>>> Issue locating domain");
                });

                // Try to identify the individual using a search of the company staff
                // Look up the organization using the domain, then search the staff for the email address or name
                let requestCompany = {
                    "api_key": API_KEY,
                    "q_organization_fuzzy_name": redirectDomain,
                    "display_mode": "fuzzy_select_mode"
                };

                let companyResult;
                try {
                    companyResult = await axios.post('https://app.apollo.io/api/v1/organizations/search', requestCompany, {timeout: 5000});
                    if (companyResult.data && companyResult.data.organizations && companyResult.data.organizations.length > 0) {
                        console.log("\t>>> " + companyResult.data.organizations[0].name);
                        console.log("\t>>> " + companyResult.data.organizations[0].id);
                    }
                } catch (exception) {
                    // we don't need to return an error here, as we will try again with the next key
                    // NOTE: debugging thought: if every n results are failing, then we may be hitting a bad key

                    console.error("---------- companyResult exception ----------");
                    console.error(exception);
                    companyResult.status = 500;
                }
                if (companyResult.status !== 200) {
                    // ignore this error and return no data
                    // - this forces this email to be skipped
                    // - (back to the top of the loop after enriching this email in the else block below)
                    companyResult.data = null;
                }

                // if we have data, process it
                if (companyResult.data && companyResult.data.organizations && companyResult.data.organizations.length > 0 && companyResult.data.organizations[0].id) {
                    let requestStaffList = {
                        "api_key": API_KEY,
                        "organization_ids": [companyResult.data.organizations[0].id],
                        "per_page": 200,
                        "page": 1
                    };

                    // If the email includes a person's name, let's use that in our search
                    let emailName = "";
                    if (emails[x].toString().includes('|')) {
                        emailName = emails[x].toString().split('|')[0].toLowerCase().trim();

                        // Remove the middle initial, if it exists
                        if (emailName.split(' ').length === 3) {
                            emailName = emailName.split(' ')[0] + ' ' + emailName.split(' ')[2];
                        }

                        requestStaffList.q_person_name = emailName;
                    }

                    let staffListResult;
                    try {
                        staffListResult = await axios.post('https://api.apollo.io/v1/mixed_people/search', requestStaffList, {timeout: 5000});
                    } catch(exception) {
                        console.error("---------- staffListResult (a) exception ----------");
                        console.error(exception);
                        staffListResult.status = 500;
                    }
                    if (staffListResult.status !== 200) {
                        staffListResult.data = null;
                    }

                    // console.log(staffListResult.data);
                    console.log("\t>>> staffListResult.data.people.length: " + staffListResult.data.people.length);
                    console.log("\t>>> staffListResult.data.contacts.length: " + staffListResult.data.contacts.length);

                    let continueQuerying = false;
                    let page = 1;
                    do {
                        if (staffListResult.data && (staffListResult.data.people.length > 0 || staffListResult.data.contacts.length > 0)) {
                            let found = false;

                            let people = [];
                            if (staffListResult.data.people.length > 0) {
                                people = people.concat(staffListResult.data.people);
                            }
                            if (staffListResult.data.contacts.length > 0) {
                                people = people.concat(staffListResult.data.contacts);
                            }

                            console.log('\t>>> people.length: ' + people.length);
                            console.log('\t>>> looping...');
                            for (let z = 0; z < people.length; z++) {
                                console.log("\t>>>\t>>> " + people[z].name);
                            }

                            // If we find either the email or the person's name matching, then we are done
                            for (let y = 0; y < people.length; y++) {
                                if (people[y].email && people[y].email.toString().toLowerCase() === emails[x].toString().toLowerCase()) {
                                    found = true;
                                    enriched.push({
                                        "email": emails[x].toString().toLowerCase(),
                                        "enriched": true,
                                        "data": people[y]
                                    });
                                    console.log("\t>>> Found");
                                }
                                if (people[y].name && people[y].name.toString().toLowerCase() === emailName.toLowerCase()) {
                                    found = true;
                                    enriched.push({
                                        "email": emails[x].toString().toLowerCase(),
                                        "enriched": true,
                                        "data": people[y]
                                    });
                                    console.log("\t>>> Found");
                                }
                            }
                            if (!found && !continueQuerying) {
                                enriched.push({
                                    "email": emails[x],
                                    "enriched": false
                                });
                            }
                            continue;
                        }

                        if (staffListResult.data && staffListResult.data.pagination && staffListResult.data.pagination.total_pages > page) {
                            page++;
                            requestStaffList.page = page;
                            continueQuerying = true;

                            try {
                                staffListResult = await axios.post('https://api.apollo.io/v1/mixed_people/search', requestStaffList, {timeout: 5000});
                            } catch(exception) {
                                console.error("---------- staffListResult (b) exception ----------");
                                console.error(exception);
                                staffListResult.status = 500;
                            }
                            if (staffListResult.status !== 200) {
                                staffListResult.data = null;
                            }
                        } else {
                            continueQuerying = false;
                        }

                    } while (continueQuerying);

                }
                else {
                    enriched.push({
                        "email": emails[x].toString().toLowerCase(),
                        "enriched": false
                    });
                }
            }
        }

        await asyncWait(1000); // Wait 5 second between requests
    }

    if (enriched.length === 0) {
        return response.notfound('\t>>> No results found');
    }

    // Convert to CSV (if requested)
    if (input.format && input.format.toString().toLowerCase() === 'csv') {
        const csv = await json2csv(enriched);
        return response.successcsv(csv);
    } else {
        return response.successtext(enriched);
    }

}
