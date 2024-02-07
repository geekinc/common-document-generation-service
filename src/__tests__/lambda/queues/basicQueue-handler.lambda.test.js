import {Context, Event} from "../../../lib/serverless-lib.js";
const { promise, callback } = require('../../../lambda/queues/basicQueue-handler.js');
process.env.LOG_LEVEL = 'off';

/**
 * This tests the "happy path" functionality with a defined callback
 */
test('basicQueue async callback - simple call to fetch results', async () => {
    let event = new Event();
    let context = new Context();

    let result = await callback(event, context, (value)  => { return value })
    expect(result).toBe('oxter');
});

/**
 * This tests the "happy path" functionality from the main promise
 */
test('basicQueue async promise - simple call to fetch results', async () => {
    let event = new Event();
    let context = new Context();

    // Return the result to the callback to be formatted ther
    let result = await promise(event, context)
    expect(result).toBe("armpit/oxter");
});
