// This is just a stubbed out logger that can be replaced with a more robust logging solution

export const logger = {
    info: async (message) => {
        console.log(message)
    },
    warn: async (message) => {
        console.warn(message)
    },
    error: async (exception_or_custommessage) => {
        console.error(exception_or_custommessage ?? 'An error occurred.');
    }
};
