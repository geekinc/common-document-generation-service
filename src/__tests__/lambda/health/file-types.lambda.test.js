const { Event, Context } = require('../../../lib/serverless-lib.js');
const { handler } = require('../../../lambda/health/file-types.js');
process.env.LOG_LEVEL = 'off';

/**
 * Get the supported file types - sandbox response
 */
test('file-types - basic response', async () => {
    let event = new Event();
    let context = new Context();

    // Ensure we are in sandbox mode
    const oldKey = process.env.CARBONE_KEY;
    process.env.CARBONE_KEY = 'test_sandbox_key_of_awesomeness';

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(200);

    // Reset the key
    process.env.CARBONE_KEY = oldKey;
});

/**
 * Get the supported file types - standard response
 */
test('file-types - basic response', async () => {
    let event = new Event();
    let context = new Context();

    // Ensure we are in sandbox mode
    const oldKey = process.env.CARBONE_KEY;
    process.env.CARBONE_KEY = 'production_key_of_awesomeness';

    // Call our method
    let result = await handler(event, context);

    // Check the response
    expect(result.statusCode).toBe(200);

    // Reset the key
    process.env.CARBONE_KEY = oldKey;
});
