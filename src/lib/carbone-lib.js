/**
 * IMPORTANT: Most of the code from this file was originally from the original common document generation service
 *            Credit where credit is due.  This code was originally written by the original author of the CDGS.
 */
import carbone from 'carbone';

// Initialize carbone formatters and add a marker to indicate defaults...
// Carbone is a singleton and we cannot set formatters for each render call
const DEFAULT_CARBONE_FORMATTERS = Object.freeze(Object.assign({}, carbone.formatters));

export const fileTypes = Object.freeze({
    csv: ['csv', 'doc', 'docx', 'html', 'odt', 'pdf', 'rtf', 'txt'],
    docx: ['doc', 'docx', 'html', 'odt', 'pdf', 'rtf', 'txt'],
    html: ['html', 'odt', 'pdf', 'rtf', 'txt'],
    ods: ['csv', 'ods', 'pdf', 'txt', 'xls', 'xlsx'],
    odt: ['doc', 'docx', 'html', 'odt', 'pdf', 'rtf', 'txt'],
    pptx: ['odt', 'pdf', 'ppt', 'pptx'],
    rtf: ['docx', 'pdf'],
    txt: ['doc', 'docx', 'html', 'odt', 'pdf', 'rtf', 'txt'],
    xlsx: ['csv', 'ods', 'pdf', 'rtf', 'txt', 'xls', 'xlsx']
});

function addFormatters(formatters) {
    if (Object.keys(formatters).length) {
        carbone.formatters = Object.assign({}, DEFAULT_CARBONE_FORMATTERS);
        carbone.addFormatters(formatters);
        return true;
    }
    return false;
}

function resetFormatters(reset) {
    if (reset) {
        carbone.formatters = Object.assign({}, DEFAULT_CARBONE_FORMATTERS);
    }
}
