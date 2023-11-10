import { DEFAULT_KEY, coordinator } from "./coordinator-lib";
import {getIndustryIDsFromNames} from "./general-lib";
import axios from "axios";

function processEmployeeCounts(employees) {
    // swap the '-' with a ',' for each entry in the array
    let new_employees = [];
    for (let i = 0; i < employees.length; i++) {
        new_employees.push(employees[i].replace('-', ','));
    }
    return new_employees;
}

export async function process_apollo(query, pageNumber = 1) {
    let api_key = DEFAULT_KEY;
    try {
        api_key = await coordinator.api_key('apollo.io');
    } catch (e) {
        console.error(e);
    }

    // Call apollo API with the details from the request
    let apollo_options = {
        url: 'https://api.apollo.io/v1/mixed_people/search',
        timeout: 5000,
        method: 'POST',
        data: {
            "api_key": api_key,
            "contact_email_status": ["verified"],
            "per_page": 100,
            "page": pageNumber
        },
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log(query);

    if (query.advanced > 0) {
        apollo_options.data = { ...apollo_options.data, ...query};
        delete apollo_options.data.id;
        delete apollo_options.data.advanced;
        delete apollo_options.data.customer;
    } else {
        apollo_options.data.contact_email_status = ["verified"];

        // Add the various parameters to the query based on if they exist or not
        if (query.keyword) {
            apollo_options.data.q_keywords = query.keyword;
        }

        if (query.job_title.length > 0) {
            apollo_options.data.person_titles = query.job_title;
        }

        if (query.location.length > 0) {
            apollo_options.data.person_locations = query.location;
        }

        if (query.industry.length > 0) {
            apollo_options.data.organization_industry_tag_ids = getIndustryIDsFromNames(query.industry);
        }

        if (query.number_of_employees.length > 0) {
            apollo_options.data.organization_num_employees_ranges = processEmployeeCounts(query.number_of_employees);
        }

        if (query.company_revenue_max && query.company_revenue_min && query.company_revenue_max > query.company_revenue_min) {
            apollo_options.data.revenue_range = {
                "max": query.company_revenue_max.toString(),
                "min": query.company_revenue_min.toString()
            };
        }
    }

    console.log('-------------------');
    console.log('Apollo Query');
    console.log('-------------------');
    console.log(apollo_options);

    return await axios.request(apollo_options).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.error(error);
        return 0;
    });
}
