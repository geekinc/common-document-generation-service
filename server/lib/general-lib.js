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
