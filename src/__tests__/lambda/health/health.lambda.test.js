const { Event, Context } = require('../../../lib/serverless-lib.js');
const { handler } = require('../../../lambda/health/health.js');

/**
 * Test the health method with a basic response
 */
test('health - basic response', async () => {
    let event = new Event();
    let context = new Context();

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(200);
});
