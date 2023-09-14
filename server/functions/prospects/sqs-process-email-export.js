import util from "util";

export async function main(event, context, req) {
    try {
        // Process each message from the event
        for (let record of event.Records) {
            let data = JSON.parse(record.body);
            console.log("Processing: " + data);
        }
    } catch (e) {
        console.log(util.inspect(e, {showHidden: false, depth: null, colors: true, maxArrayLength: 500}));
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
