// This is just a stubbed out logger that can be replaced with a more robust logging solution

export const logger = {
    info: async (message) => {
        /* istanbul ignore next */
        (process.env.LOG_LEVEL === 'info') ? console.log(message) : null;
    },
    warn: async (message) => {
        /* istanbul ignore next */
        (process.env.LOG_LEVEL === 'info' || process.env.LOG_LEVEL === 'warn') ? console.warn(message) : null;
    },
    error: async (exception_or_custommessage) => {
        /* istanbul ignore next */
        (process.env.LOG_LEVEL !== 'off') ? console.error(exception_or_custommessage ?? 'An error occurred.') : null;
    }
};
