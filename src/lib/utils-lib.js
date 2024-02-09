/**
 * IMPORTANT: Most of the code from this file was originally from the original common document generation service
 *            Credit where credit is due.  This code was originally written by the original author of the CDGS.
 */
/* istanbul ignore file */

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
 * @param {any} value The input to evaluate
 * @returns {boolean} True if truthy, false otherwise
 */
export const truthy = (value) => {
    return (value === true || value === 'true' || value === '1' || value === 'yes' || value === 'y' || value === 't' || value === 1);
}


/**
 * Returns the UNIX timestamp for the given `date`. Defaults to `Date.now()`
 * when not providing the `date` argument to the method call.
 *
 * @returns {Number}
 */
export const unixTimestamp = (date = Date.now()) => {
    return Math.floor(date / 1000)
}


/**
 * Returns the default contentType given a file extension
 *
 * @returns {Number}
 */
export const getContentType = (ext) => {
    const extTypes = {
        "3gp"   : "video/3gpp",
        "a"     : "application/octet-stream",
        "ai"    : "application/postscript",
        "aif"   : "audio/x-aiff",
        "aiff"  : "audio/x-aiff",
        "asc"   : "application/pgp-signature",
        "asf"   : "video/x-ms-asf",
        "asm"   : "text/x-asm",
        "asx"   : "video/x-ms-asf",
        "atom"  : "application/atom+xml",
        "au"    : "audio/basic",
        "avi"   : "video/x-msvideo",
        "bat"   : "application/x-msdownload",
        "bin"   : "application/octet-stream",
        "bmp"   : "image/bmp",
        "bz2"   : "application/x-bzip2",
        "c"     : "text/x-c",
        "cab"   : "application/vnd.ms-cab-compressed",
        "cc"    : "text/x-c",
        "chm"   : "application/vnd.ms-htmlhelp",
        "class"   : "application/octet-stream",
        "com"   : "application/x-msdownload",
        "conf"  : "text/plain",
        "cpp"   : "text/x-c",
        "crt"   : "application/x-x509-ca-cert",
        "css"   : "text/css",
        "csv"   : "text/csv",
        "cxx"   : "text/x-c",
        "deb"   : "application/x-debian-package",
        "der"   : "application/x-x509-ca-cert",
        "diff"  : "text/x-diff",
        "djv"   : "image/vnd.djvu",
        "djvu"  : "image/vnd.djvu",
        "dll"   : "application/x-msdownload",
        "dmg"   : "application/octet-stream",
        "doc"   : "application/msword",
        "dot"   : "application/msword",
        "dtd"   : "application/xml-dtd",
        "dvi"   : "application/x-dvi",
        "ear"   : "application/java-archive",
        "eml"   : "message/rfc822",
        "eps"   : "application/postscript",
        "exe"   : "application/x-msdownload",
        "f"     : "text/x-fortran",
        "f77"   : "text/x-fortran",
        "f90"   : "text/x-fortran",
        "flv"   : "video/x-flv",
        "for"   : "text/x-fortran",
        "gem"   : "application/octet-stream",
        "gemspec" : "text/x-script.ruby",
        "gif"   : "image/gif",
        "gz"    : "application/x-gzip",
        "h"     : "text/x-c",
        "hh"    : "text/x-c",
        "htm"   : "text/html",
        "html"  : "text/html",
        "ico"   : "image/vnd.microsoft.icon",
        "ics"   : "text/calendar",
        "ifb"   : "text/calendar",
        "iso"   : "application/octet-stream",
        "jar"   : "application/java-archive",
        "java"  : "text/x-java-source",
        "jnlp"  : "application/x-java-jnlp-file",
        "jpeg"  : "image/jpeg",
        "jpg"   : "image/jpeg",
        "js"    : "application/javascript",
        "json"  : "application/json",
        "log"   : "text/plain",
        "m3u"   : "audio/x-mpegurl",
        "m4v"   : "video/mp4",
        "man"   : "text/troff",
        "mathml"  : "application/mathml+xml",
        "mbox"  : "application/mbox",
        "mdoc"  : "text/troff",
        "me"    : "text/troff",
        "mid"   : "audio/midi",
        "midi"  : "audio/midi",
        "mime"  : "message/rfc822",
        "mml"   : "application/mathml+xml",
        "mng"   : "video/x-mng",
        "mov"   : "video/quicktime",
        "mp3"   : "audio/mpeg",
        "mp4"   : "video/mp4",
        "mp4v"  : "video/mp4",
        "mpeg"  : "video/mpeg",
        "mpg"   : "video/mpeg",
        "ms"    : "text/troff",
        "msi"   : "application/x-msdownload",
        "odp"   : "application/vnd.oasis.opendocument.presentation",
        "ods"   : "application/vnd.oasis.opendocument.spreadsheet",
        "odt"   : "application/vnd.oasis.opendocument.text",
        "ogg"   : "application/ogg",
        "p"     : "text/x-pascal",
        "pas"   : "text/x-pascal",
        "pbm"   : "image/x-portable-bitmap",
        "pdf"   : "application/pdf",
        "pem"   : "application/x-x509-ca-cert",
        "pgm"   : "image/x-portable-graymap",
        "pgp"   : "application/pgp-encrypted",
        "pkg"   : "application/octet-stream",
        "pl"    : "text/x-script.perl",
        "pm"    : "text/x-script.perl-module",
        "png"   : "image/png",
        "pnm"   : "image/x-portable-anymap",
        "ppm"   : "image/x-portable-pixmap",
        "pps"   : "application/vnd.ms-powerpoint",
        "ppt"   : "application/vnd.ms-powerpoint",
        "ps"    : "application/postscript",
        "psd"   : "image/vnd.adobe.photoshop",
        "py"    : "text/x-script.python",
        "qt"    : "video/quicktime",
        "ra"    : "audio/x-pn-realaudio",
        "rake"  : "text/x-script.ruby",
        "ram"   : "audio/x-pn-realaudio",
        "rar"   : "application/x-rar-compressed",
        "rb"    : "text/x-script.ruby",
        "rdf"   : "application/rdf+xml",
        "roff"  : "text/troff",
        "rpm"   : "application/x-redhat-package-manager",
        "rss"   : "application/rss+xml",
        "rtf"   : "application/rtf",
        "ru"    : "text/x-script.ruby",
        "s"     : "text/x-asm",
        "sgm"   : "text/sgml",
        "sgml"  : "text/sgml",
        "sh"    : "application/x-sh",
        "sig"   : "application/pgp-signature",
        "snd"   : "audio/basic",
        "so"    : "application/octet-stream",
        "svg"   : "image/svg+xml",
        "svgz"  : "image/svg+xml",
        "swf"   : "application/x-shockwave-flash",
        "t"     : "text/troff",
        "tar"   : "application/x-tar",
        "tbz"   : "application/x-bzip-compressed-tar",
        "tcl"   : "application/x-tcl",
        "tex"   : "application/x-tex",
        "texi"  : "application/x-texinfo",
        "texinfo" : "application/x-texinfo",
        "text"  : "text/plain",
        "tif"   : "image/tiff",
        "tiff"  : "image/tiff",
        "torrent" : "application/x-bittorrent",
        "tr"    : "text/troff",
        "txt"   : "text/plain",
        "vcf"   : "text/x-vcard",
        "vcs"   : "text/x-vcalendar",
        "vrml"  : "model/vrml",
        "war"   : "application/java-archive",
        "wav"   : "audio/x-wav",
        "wma"   : "audio/x-ms-wma",
        "wmv"   : "video/x-ms-wmv",
        "wmx"   : "video/x-ms-wmx",
        "wrl"   : "model/vrml",
        "wsdl"  : "application/wsdl+xml",
        "xbm"   : "image/x-xbitmap",
        "xhtml"   : "application/xhtml+xml",
        "xls"   : "application/vnd.ms-excel",
        "xml"   : "application/xml",
        "xpm"   : "image/x-xpixmap",
        "xsl"   : "application/xml",
        "xslt"  : "application/xslt+xml",
        "yaml"  : "text/yaml",
        "yml"   : "text/yaml",
        "zip"   : "application/zip"
    }
    return extTypes[ext.toLowerCase()] || 'application/octet-stream';
}


export function octetStreamToBase64(dataArr){
    let encoder = new TextEncoder("ascii");
    let decoder = new TextDecoder("ascii");
    let base64Table = encoder.encode('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=');

    let padding = dataArr.byteLength % 3;
    let len = dataArr.byteLength - padding;
    padding = padding > 0 ? (3 - padding) : 0;
    let outputLen = ((len/3) * 4) + (padding > 0 ? 4 : 0);
    let output = new Uint8Array(outputLen);
    let outputCtr = 0;
    for(let i=0; i<len; i+=3){
        let buffer = ((dataArr[i] & 0xFF) << 16) | ((dataArr[i+1] & 0xFF) << 8) | (dataArr[i+2] & 0xFF);
        output[outputCtr++] = base64Table[buffer >> 18];
        output[outputCtr++] = base64Table[(buffer >> 12) & 0x3F];
        output[outputCtr++] = base64Table[(buffer >> 6) & 0x3F];
        output[outputCtr++] = base64Table[buffer & 0x3F];
    }
    if (padding === 1) {
        let buffer = ((dataArr[len] & 0xFF) << 8) | (dataArr[len+1] & 0xFF);
        output[outputCtr++] = base64Table[buffer >> 10];
        output[outputCtr++] = base64Table[(buffer >> 4) & 0x3F];
        output[outputCtr++] = base64Table[(buffer << 2) & 0x3F];
        output[outputCtr++] = base64Table[64];
    } else if (padding === 2) {
        let buffer = dataArr[len] & 0xFF;
        output[outputCtr++] = base64Table[buffer >> 2];
        output[outputCtr++] = base64Table[(buffer << 4) & 0x3F];
        output[outputCtr++] = base64Table[64];
        output[outputCtr++] = base64Table[64];
    }

    let ret = decoder.decode(output);
    output = null;
    dataArr = null;
    return ret;
}
