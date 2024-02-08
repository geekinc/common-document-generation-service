/**
 * IMPORTANT: Most of the code from this file was originally from the original common document generation service
 *            Credit where credit is due.  This code was originally written by the original author of the CDGS.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger-lib.js';


/**
 * @function determineCarboneErrorCode
 * We want to return 422s if the template has a user error in it's construction.
 * Carbone doesn't throw specific errors in this case, so we'll do a best-effort of
 * determining if it should be a 422 or not (keep doing a 500 in any other case)
 * @param {err} String The thrown exception from Carbone
 * @returns {integer} The output filename for the response
 */
export const determineCarboneErrorCode = async (err) => {
    try {
        if (err && /formatter .*does not exist|missing at least one|cannot access parent object in/gmi.test(err))
            return 422;
    } catch (e) {
        // Safety here, this method should never cause any unhandled exception since it's an error code determiner
        logger.warn('Error while determining carbone error code: ${e}', { function: 'determineCarboneErrorCode' });

    }
    return 500;
}

/**
 * @function determineOutputReportName
 * For the DocGen component, determine what the outputted (response) filename should be based
 * on the template object from the request body,
 * @param {template} obj The template field from the request
 * @returns {string} The output filename for the response
 */
export const determineOutputReportName = async (template) => {
    const extension = template.outputFileType ? template.outputFileType : template.contentFileType;
    const name = template.outputFileName ? template.outputFileName : uuidv4();
    return `${name}.${extension}`;
}

/**
 * @function getFileExtension
 * From a string representing a filename, get the extension if there is one
 * @param {filename} string A filename in a string
 * @returns {string} The extension, ie ".docx", or undefined if there is none
 */
export const getFileExtension = async (filename) => {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(filename)[1];
}

/**
 * @function getGitRevision
 * Gets the current git revision hash
 * @see {@link https://stackoverflow.com/a/34518749}
 * @returns {string} The git revision hash, or empty string
 */
export function getGitRevision() {
    try {
        const gitDir = (() => {
            let dir = '.git', i = 0;
            while (!existsSync(join(__dirname, dir)) && i < 5) {
                dir = '../' + dir;
                i++;
            }
            return dir;
        })();

        const head = readFileSync(join(__dirname, `${gitDir}/HEAD`)).toString().trim();
        return (head.indexOf(':') === -1)
            ? head
            : readFileSync(join(__dirname, `${gitDir}/${head.substring(5)}`)).toString().trim();
    } catch (err) {
        log.warn(err.message, { function: 'getGitRevision' });
        return '';
    }
}

/**
 * @function prettyStringify
 * Returns a pretty JSON representation of an object
 * @param {object} obj A JSON Object
 * @param {integer} indent Number of spaces to indent
 * @returns {string} A pretty printed string representation of `obj` with `indent` indentation
 */
export const prettyStringify = (obj, indent = 2) => JSON.stringify(obj, null, indent)

/**
 * @function truthy
 * Returns true if the element name in the object contains a truthy value
 * @param {string} name The attribute name
 * @param {object} obj The object to evaluate
 * @returns {boolean} True if truthy, false otherwise
 */
export const truthy = (name, obj = {}) => {
    const value = obj[name] || false;
    return (value === true || value === 'true' || value === '1' || value === 'yes' || value === 'y' || value === 't' || value === 1);
}