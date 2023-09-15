import response from "../../lib/response-lib";
import {coordinator} from "../../lib/coordinator-lib";
const axios = require('axios');

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
        "api_key": await coordinator.api_key('apollo.io'),
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
