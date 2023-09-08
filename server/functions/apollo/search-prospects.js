import response from "../../lib/response-lib";
const axios = require('axios');

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const keys = [
    "mDSuNyxv-x5wNgRnyKei5g",
    "gs_ytoBmZht7mm8fWN_IoQ",
    "jq3u7hN8I69TEe0J7eRwEQ",
    "wJTpegcDY2mTzi8l2eLKAw"
];
let currentKey = randomIntFromInterval(0, keys.length - 1);
let API_KEY = process.env.API_KEY || keys[currentKey];
const asyncWait = ms => new Promise(resolve => setTimeout(resolve, ms));

/***********************************************************************************************************************
 * Security Requirements:
 * None - this is wide open
 ***********************************************************************************************************************/

function getIndustryIDsFromNames(industryArray) {
    let industries = require('../../data/industries.json');

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

export async function main(event, context) {
    let input = JSON.parse(event.body);
    console.log(input);

    let query = {
        "api_key": API_KEY,
        "contact_email_status": ["verified"],
        "per_page": 1,
        "page": 1
    };

    // Add the various parameters to the query based on if they exist or not
    if (input.job_title) {
        query.person_titles = input.job_title;
    }

    if (input.location) {
        query.person_locations = input.location;
    }

    if (input.industry) {
        query.organization_industry_tag_ids = getIndustryIDsFromNames(input.industry);
    }

    if (input.number_of_employees) {
        query.organization_num_employees_ranges = input.number_of_employees;
    }

    if (input.company_revenue_max && input.company_revenue_min && input.company_revenue_max > input.company_revenue_min) {
        query.revenue_range = {
            "max": input.company_revenue_max.toString(),
            "min": input.company_revenue_min.toString()
        };
    }

    console.log(query);

    let result;
    try {
        result = await axios.post('https://api.apollo.io/v1/mixed_people/search', query,
            {timeout: 5000,
                headers: {
                    'Content-Type': 'application/json'
            }});
        console.log(result);
    } catch (exception) {
        console.log(exception);
        result.status = 500;
    }
    if (result.status !== 200) {
        return response.failure('Error calling Apollo API');
    }

    return response.success(result.data.pagination);

}
