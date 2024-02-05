const { Event, Context } = require('../../../lib/serverless-lib.js');
const { armpit } = require('../../../lambda/armpit/armpit.js');

/**
 * Test the armpit method with a basic response
 */
test('armpit - basic response', async () => {
    let event = new Event();
    let context = new Context();

    // Call our method
    let result = await armpit(event, context);

    // Check the response
    expect(result.body).toBe('oxter');
});
