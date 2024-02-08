// Notes on Carbone installation: https://www.npmjs.com/package/carbone/v/1.1.0
// Carbone API: https://carbone.io/api/

import axios from 'axios';
import { logger } from './logger-lib.js';
import * as fs from "fs";

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

export const sandboxFileTypes = Object.freeze({
    csv: ['pdf'],
    docx: ['pdf'],
    html:['pdf'],
    ods: ['pdf'],
    odt: ['pdf'],
    pptx: ['pdf'],
    rtf: ['pdf'],
    txt: ['pdf'],
    xlsx: ['pdf'],
});

export async function addTemplate(template) {
    await logger.info('carbone-lib.addTemplate() - called');
    await logger.info('carbone-lib.addTemplate() - template: ' + template);

    return await axios.post(
        process.env.CARBONE_URL + '/template',
        {
            template: fs.createReadStream(template)
        },
        {
            headers: {
                'Authorization': 'Bearer ' + process.env.CARBONE_KEY,
                'carbone-version': '4',
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(function (response) {
            return { status: 'success', data: response.data };
        })
        .catch(function (error) {
            return { status: 'error', data: error };
        });
}

export async function deleteTemplate(templateId) {
    await logger.info('carbone-lib.deleteTemplate() - called');
    await logger.info('carbone-lib.deleteTemplate() - templateId: ' + templateId);

    return await axios.delete(
        process.env.CARBONE_URL + '/template/' + templateId,
        {
            headers: {
                'Authorization': 'Bearer ' + process.env.CARBONE_KEY,
                'carbone-version': '4'
            }
        })
        .then(function (response) {
            return { status: 'success', data: response.data };
        })
        .catch(function (error) {
            return { status: 'error', data: error };
        });
}

export async function fetchTemplate(templateId) {
    await logger.info('carbone-lib.fetchTemplate() - called');
    await logger.info('carbone-lib.fetchTemplate() - templateId: ' + templateId);

    return await axios.get(
        process.env.CARBONE_URL + '/template/' + templateId,
        {
            headers: {
                'Authorization': 'Bearer ' + process.env.CARBONE_KEY,
                'carbone-version': '4'
            }
        })
        .then(function (response) {
            return { status: 'success', data: response.data };
        })
        .catch(function (error) {
            return { status: 'error', data: error };
        });
}

export async function fetchStatus() {
    await logger.info('carbone-lib.fetchStatus() - called');

    return await axios.get(
        process.env.CARBONE_URL + '/status',
        {
            headers: {
                'Authorization': 'Bearer ' + process.env.CARBONE_KEY,
                'carbone-version': '4'
            }
        })
        .then(function (response) {
            return { status: 'success', data: response.data };
        })
        .catch(function (error) {
            return { status: 'error', data: error };
        });
}

export async function generateDocument(template, data, options) {
    await logger.info('carbone-lib.generateDocument() - called');
    await logger.info('carbone-lib.generateDocument() - template: ' + template);

    // Check for required template parameter
    if (!template) {
        return { status: 'error', data: 'Template not specified.' };
    }

    // Set data and options to sane defaults if not provided
    if (arguments.length === 1) {
        data = {};
        options = {};
    }
    if (arguments.length === 2) {
        options = {};
    }

    let defaultPayload = {
        data: {},
        convertTo: "pdf",
        timezone: "America/Los_Angeles",
        lang: "en",
        complement: {},
        variableStr: "",
        reportName: "document",
        enum: {},
        translations: {},
        currencySource: "",
        currencyTarget: "",
        currencyRates: {},
        hardRefresh: ""
    }

    // Set all options with default values (if not submitted) in the payload for the Carbone API
    let payload = {
        ...defaultPayload,
        ...options
    }
    payload.data = data;

    // Call the Carbone API
    return await axios.post(
        process.env.CARBONE_URL + '/render/' + template,
        payload,
        {
            headers: {
                'Authorization': 'Bearer ' + process.env.CARBONE_KEY,
                'carbone-version': '4',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            return { status: 'success', data: response.data };
        })
        .catch(function (error) {
            return { status: 'error', data: error };
        });
}

export async function retrieveDocument(documentId) {
    await logger.info('carbone-lib.retrieveDocument() - called');
    await logger.info('carbone-lib.retrieveDocument() - documentId: ' + documentId);

    return await axios.get(
        process.env.CARBONE_URL + '/render/' + documentId,
        {
            headers: {
                'Authorization': 'Bearer ' + process.env.CARBONE_KEY,
                'carbone-version': '4'
            }
        })
        .then(function (response) {
            return { status: 'success', data: response.data };
        })
        .catch(function (error) {
            return { status: 'error', data: error };
        });
}
