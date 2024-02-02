export const logger = {
    info: (message, param) => param ? console.log(message, param) : console.log(message),
    warn: (message, param) => param ? console.warn(message, param) : console.warn(message),
    error: async (exception_or_custommessage, event) => {
        console.error('---------------- General Error -----------------');
        console.error(exception_or_custommessage ?? 'An error occurred.');
        console.error(event);
    },
    security: async (event, mssql) => {
        console.error('---------------- Security Error ----------------');
        console.error(event);
    }
};
