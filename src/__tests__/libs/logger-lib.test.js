const { logger } = require('../../lib/logger-lib.js');

let output = '';

// Mock console methods for testing
jest.spyOn(console, "log").mockImplementation((message) => { output = message; });
jest.spyOn(console, "warn").mockImplementation((message) => { output = message; });
jest.spyOn(console, "error").mockImplementation((message) => { output = message; });

test('logger-lib - send simple logs', async () => {

    process.env.LOG_LEVEL = 'info';
    await logger.info('test 1');
    expect(output).toBe('test 1');

    process.env.LOG_LEVEL = 'warn';
    await logger.warn('test 2');
    expect(output).toBe('test 2');

    process.env.LOG_LEVEL = 'error';
    await logger.error('test 3');
    expect(output).toBe('test 3');

});
