import dynamoDb from "./dynamodb-lib";
import { sleep } from "./general-lib";

export const DEFAULT_KEY = 'iAw6Qq-w9nmZsCYvcLGW1g';

async function get_api_headers(provider) {
    let loop_count = 0;
    let loop_max = 10;
    let delay = 25;   // This is a magic number calculated from the number of available resources divided by timeouts
    let found;

    // Find the correct value - delay if needed
    while (loop_count <= loop_max) {
        try {
            const time_stamp = Math.floor(Date.now()) - 50;
            const params = {
                TableName: process.env.api_accounts_table_name,
                KeyConditionExpression: "provider = :provider AND id > :id",
                FilterExpression: "last_used < :timestamp",
                ExpressionAttributeValues: {
                    ":provider": provider,
                    ":id": 0,
                    ":timestamp": time_stamp
                }
            };
            found = await dynamoDb.query(params);
        } catch(e) {
            console.log(">>> Lookup Error");
            console.log(e);
            return DEFAULT_KEY;
        }

        if (found.Items.length > 0) {
            loop_count = loop_max + 1;
        } else {
            await sleep(delay);
        }
    }

    if (found.Items.length > 0) {
        // Update the new record with the correct time
        try {
            const params = {
                TableName: process.env.api_accounts_table_name,
                Key: {
                    "provider": found.Items[0].provider,
                    "id": found.Items[0].id
                },
                UpdateExpression: "set last_used = :x",
                ExpressionAttributeValues: {
                    ":x":  Math.floor(Date.now()),
                }
            };
            await dynamoDb.update(params);
        } catch (e) {
            console.log(">>> Insert Error");
            console.log(e);
            return DEFAULT_KEY;
        }
        return found.Items[0].headers;
    } else {
        return DEFAULT_KEY;
    }
}

async function get_api_key(provider) {
    let loop_count = 0;
    let loop_max = 10;
    let delay = 25;   // This is a magic number calculated from the number of available resources divided by timeouts
    let found;

    // Find the correct value - delay if needed
    while (loop_count <= loop_max) {
        try {
            const time_stamp = Math.floor(Date.now()) - 50;
            const params = {
                TableName: process.env.api_accounts_table_name,
                KeyConditionExpression: "provider = :provider AND id > :id",
                FilterExpression: "last_used < :timestamp",
                ExpressionAttributeValues: {
                    ":provider": provider,
                    ":id": 0,
                    ":timestamp": time_stamp
                }
            };
            found = await dynamoDb.query(params);
        } catch(e) {
            console.log(">>> Lookup Error");
            console.log(e);
            return DEFAULT_KEY;
        }

        if (found.Items.length > 0) {
            loop_count = loop_max + 1;
        } else {
            await sleep(delay);
        }
    }

    if (found.Items.length > 0) {
        // Update the new record with the correct time
        try {
            const params = {
                TableName: process.env.api_accounts_table_name,
                Key: {
                    "provider": found.Items[0].provider,
                    "id": found.Items[0].id
                },
                UpdateExpression: "set last_used = :x",
                ExpressionAttributeValues: {
                    ":x":  Math.floor(Date.now()),
                }
            };
            await dynamoDb.update(params);
        } catch (e) {
            console.log(">>> Insert Error");
            console.log(e);
            return DEFAULT_KEY;
        }
        return found.Items[0].api_key;
    } else {
        return DEFAULT_KEY;
    }
}

export const coordinator = {
    headers: (provider) => get_api_headers(provider),
    api_key: (provider) => get_api_key(provider)
};
