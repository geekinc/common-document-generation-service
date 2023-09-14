import util from "util";

export async function main(event, context, req) {
    try {
        // Process each message from the event
        for (let record of event.Records) {
            let prospect = JSON.parse(record.body);
            console.log(util.inspect(prospect, {showHidden: false, depth: null, colors: false, maxArrayLength: 500}));
        }
    } catch (e) {
        console.log(util.inspect(e, {showHidden: false, depth: null, colors: false, maxArrayLength: 500}));
        return {
            statusCode: 200,
            body: {},
        };
    }

    return {
        statusCode: 200,
        body: {},
    };
}
