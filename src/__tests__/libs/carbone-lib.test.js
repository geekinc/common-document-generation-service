import {
    addTemplate,
    deleteTemplate,
    fetchTemplate,
    fetchStatus,
    generateDocument,
    retrieveDocument
} from '../../lib/carbone-lib.js';
const { logger } = require('../../lib/logger-lib.js');
process.env.LOG_LEVEL = 'off';


/**
 * Define the data to be used in the tests
 */
const templateFile = `${__dirname}/../data/s3/insurance-quote-odt/template.odt`;
const templateOptions = {
    convertTo: "pdf",
    reportName: "insurance-quote.pdf"
}
const templateData = {
    "companyName": "JohnInsurance & Co",
    "period": 2,
    "sD": 1659041229,
    "id":2891,
    "insured": {
        "name": "Jean Michel",
        "street": "23, Sycamore Street",
        "city": "New York",
        "phone": "+33 2 38 99 18 23"
    },
    "showPropertyDamage": false,
    "propertyDamage": [
        {
            "type": "Fire"
        },
        {
            "type": "Wind"
        },
        {
            "type": "Hail"
        },
        {
            "type": "Water"
        }
    ],
    "options" : [
        {
            "type": "Furniture",
            "note": "/",
            "cost": 1200
        },
        {
            "type": "Appliances",
            "note": "/",
            "cost": 400
        },
        {
            "type": "Clothing",
            "note": "/",
            "cost": 300
        },
        {
            "type": "Dishes",
            "note": "in some cases",
            "cost": 300
        }
    ],
    "optionsTotalHT": 2200,
    "optionsTaxes": 10,
    "optionsTotal": 2420
};

let templateId, renderId;

/**
 * Generate a templateId and a renderId for use in the later tests
 */
beforeAll(async () => {
    // Add template and fetch id
    let result = await addTemplate(templateFile);

    console.log(result);

    templateId = result.data.data.templateId;

    // Generate the document and fetch renderId
    let generateResult = await generateDocument(templateId, templateData, templateOptions);
    renderId = generateResult.data.data.renderId;
});

/**
 * Happy Path - add a template to the Carbone server
 */
test('carbone-lib - add template', async () => {

    let result = await addTemplate(templateFile);

    expect(result.status).toBe('success');
    expect(result.data.data.templateId).toBeDefined();
}, 10000);  // 10 second timeout due to network requests

/**
 * Broken Path - add a template to the Carbone server (bad path)
 */
test('carbone-lib - add template (bad path)', async () => {
    // Path must be absolute
    const templateFile = `${__dirname}/BAD_PATH/BAD_TEMPLATE.odt`;

    let result = await addTemplate(templateFile);

    expect(result.status).toBe('error');
}, 10000);  // 10 second timeout due to network requests


/**
 * Happy Path - add a template then delete it from the Carbone server
 */
test('carbone-lib - add & delete template', async () => {

    // Add template and fetch id
    let result = await addTemplate(templateFile);
    const localTemplateId = result.data.data.templateId;

    let deleteResult = await deleteTemplate(localTemplateId);

    expect(deleteResult.status).toBe('success');
    expect(deleteResult.data.message).toBe('Template deleted');
}, 10000);  // 10 second timeout due to network requests

/**
 * Broken Path - delete a non-existent template from the Carbone server
 */
test('carbone-lib - delete non-existent template', async () => {
    // Set the invalid id
    const localTemplateId = 'INVALID_ID'

    let deleteResult = await deleteTemplate(localTemplateId);

    expect(deleteResult.status).toBe('error');
    expect(deleteResult.data.message).toBe('Request failed with status code 400');
}, 10000);  // 10 second timeout due to network requests


/**
 * Happy Path - add a template then fetch it from the Carbone server
 */
test('carbone-lib - add & fetch template', async () => {

    let fetchResult = await fetchTemplate(templateId);

    // Look for a successful response with actual data returned
    expect(fetchResult.status).toBe('success');
    expect(fetchResult.data.length).toBeGreaterThan(0);
}, 10000);  // 10 second timeout due to network requests


/**
 * Broken Path - fetch a non-existent template from the Carbone server
 */
test('carbone-lib - delete non-existent template', async () => {
    // Set the invalid id
    const localTemplateId = 'INVALID_ID'

    let fetchResult = await fetchTemplate(localTemplateId);

    expect(fetchResult.status).toBe('error');
    expect(fetchResult.data.message).toBe('Request failed with status code 400');
}, 10000);  // 10 second timeout due to network requests


/**
 * Happy Path - fetch the current server API status
 */
test('carbone-lib - fetch API status', async () => {

    let fetchResult = await fetchStatus();

    // Look for a successful response with actual data returned
    expect(fetchResult.status).toBe('success');
    expect(fetchResult.data.message).toBe("OK");
}, 10000);  // 10 second timeout due to network requests


/**
 * Broken Path - fetch the current server API status
 */
test('carbone-lib - fetch API status (broken endpoint)', async () => {
    const oldUrl = process.env.CARBONE_URL;
    process.env.CARBONE_URL = 'http://INVALID_URL:8080';

    let fetchResult = await fetchStatus();

    // Look for a successful response with actual data returned
    expect(fetchResult.status).toBe('error');

    process.env.CARBONE_URL = oldUrl;
}, 10000);  // 10 second timeout due to network requests


/**
 * Happy Path - add a template then generate a document from it
 */
test('carbone-lib - add a template then generate a document from it', async () => {

    let generateResult = await generateDocument(templateId, templateData, templateOptions);

    // Look for a successful response with actual data returned
    expect(generateResult.status).toBe('success');
    expect(generateResult.data.data.renderId).toBeDefined();
}, 10000);  // 10 second timeout due to network requests


/**
 * Broken Path - pass a null template id
 */
test('carbone-lib - generate a document, but pass a null template id', async () => {

    let generateResult = await generateDocument(null, templateData, templateOptions);

    // Look for a successful response with actual data returned
    expect(generateResult.status).toBe('error');
    expect(generateResult.data).toBe('Template not specified.');
}, 10000);  // 10 second timeout due to network requests


/**
 * Broken Path - pass a template but no data or options
 */
test('carbone-lib - pass a template but no data or options', async () => {

    // Add template and fetch id
    let result = await addTemplate(templateFile);
    const localTemplateId = result.data.data.templateId;

    let generateResult = await generateDocument(localTemplateId);

    // Look for a successful response with actual data returned
    expect(generateResult.status).toBe('success');
    expect(generateResult.data.data.renderId).toBeDefined();
}, 10000);  // 10 second timeout due to network requests


/**
 * Broken Path - pass a template but no options
 */
test('carbone-lib - pass a template but no options', async () => {

    let generateResult = await generateDocument(templateId, templateData);

    // Look for a successful response with actual data returned
    expect(generateResult.status).toBe('success');
    expect(generateResult.data.data.renderId).toBeDefined();
}, 10000);  // 10 second timeout due to network requests


/**
 * Broken Path - pass a template (broken endpoint)
 */
test('carbone-lib - pass a template (broken endpoint)', async () => {
    const oldUrl = process.env.CARBONE_URL;
    process.env.CARBONE_URL = 'http://INVALID_URL:8080';

    // Since we're testing an error on the API endpoint, we don't need a valid templateId
    let generateResult = await generateDocument('UNKNOWN_TEMPLATE');

    expect(generateResult.status).toBe('error');

    process.env.CARBONE_URL = oldUrl;
}, 10000);  // 10 second timeout due to network requests


/**
 * Happy Path - add a template then generate a document from it then fetch the document
 */
test('carbone-lib - add a template then generate a document from it then fetch the document', async () => {

    let retrieveResult = await retrieveDocument(renderId);

    // Look for a successful response with actual data returned
    expect(retrieveResult.status).toBe('success');
    expect(retrieveResult.data).toContain('%PDF-1.6\n');
}, 10000);  // 10 second timeout due to network requests


/**
 * Broken Path - fetch the document (broken endpoint)
 */
test('carbone-lib - add a template then generate a document from it then fetch the document', async () => {
    const oldUrl = process.env.CARBONE_URL;
    process.env.CARBONE_URL = 'http://INVALID_URL:8080';

    let retrieveResult = await retrieveDocument(renderId);

    // Look for a successful response with actual data returned
    expect(retrieveResult.status).toBe('error');

    process.env.CARBONE_URL = oldUrl;
}, 10000);  // 10 second timeout due to network requests

