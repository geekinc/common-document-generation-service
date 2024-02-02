import industries from "../data/industries.json";

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function parameter_exists(parameter, event) {
    let exists = false;
    if ((event.pathParameters && event.pathParameters[parameter]) || (event.body && event.body[parameter])) {
       exists = true;
    }
    return exists;
}

export function add_parameter(config, parameter, event) {
    if (parameter !== '') {

        // TODO: Add querystringparameters

        if ((event.pathParameters && event.pathParameters[parameter]) || (event.body && event.body[parameter])) {
            config[parameter] = event.pathParameters[parameter] ? event.pathParameters[parameter] : event.body[parameter];
        }
    }
    return config;
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
