const { logger } = require('../../lib/logger-lib.js');

let output = '';

// Mock console methods for testing
jest.spyOn(console, "log").mockImplementation((message) => { output = message; });
jest.spyOn(console, "warn").mockImplementation((message) => { output = message; });
jest.spyOn(console, "error").mockImplementation((message) => { output = message; });

test('logger-lib - send simple logs', async () => {

    await logger.info('test 1');
    expect(output).toBe('test 1');

    await logger.warn('test 2');
    expect(output).toBe('test 2');

    await logger.error('test 3');
    expect(output).toBe('test 3');

    await logger.error(null);
    expect(output).toBe('An error occurred.');

});
