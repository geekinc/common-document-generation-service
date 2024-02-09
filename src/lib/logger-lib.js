// This is just a stubbed out logger that can be replaced with a more robust logging solution

import {dao} from "./dao-mysql-lib.cjs";

export const logger = {
    info: async (message) => {
        /* istanbul ignore next */
        (process.env.LOG_LEVEL === 'info') ? console.log(message) : null;

        // This should be replaced with something more robust
        await dao.run(
            'INSERT INTO log (log_level, message) VALUES (?,?)',
            ["INFO", message]
        );
    },
    warn: async (message) => {
        /* istanbul ignore next */
        (process.env.LOG_LEVEL === 'info' || process.env.LOG_LEVEL === 'warn') ? console.warn(message) : null;

        // This should be replaced with something more robust
        await dao.run(
            'INSERT INTO log (log_level, message) VALUES (?,?)',
            ["WARN", message]
        );
    },
    error: async (exception_or_custommessage) => {
        /* istanbul ignore next */
        (process.env.LOG_LEVEL !== 'off') ? console.error(exception_or_custommessage ?? 'An error occurred.') : null;

        // This should be replaced with something more robust
        await dao.run(
            'INSERT INTO log (log_level, message) VALUES (?,?)',
            ["ERROR", exception_or_custommessage]
        );
    }
};
