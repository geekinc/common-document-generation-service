import Templates from '../../lib/template-lib.js';
import { unixTimestamp } from "../../lib/utils-lib.js";

process.env.LOG_LEVEL = 'off';

let output = '';
let templateId = null

// Mock console methods for testing
jest.spyOn(console, "error").mockImplementation((message) => { output = message; });

/**
 * Generate a templateId
 */
beforeAll(async () => {
    const timestamp = unixTimestamp();
    const templateData = {
        filename: "tiny.gif",
        filetype: "image/gif",
        storage_location: "template-" + timestamp.toString() + "-tiny.gif",
        created_on: timestamp,
        carbone_id: '3e28bed1bf184741b8055575708a82ca'
    }

    let result = await Templates.createTemplate(templateData, 'foo');

    // Save the id for later
    templateId = result.insertId;
});

/**
 * Clean up the tests
 */
afterAll(async () => {
    // Delete the template created at the beginning of the tests
    await Templates.deleteTemplate(templateId);
});

/**
 * Happy path - create a template
 *
 **/
test('template-lib - create a template', async () => {
    const timestamp = unixTimestamp();
    const templateData = {
        filename: "tiny.png",
        filetype: "image/png",
        storage_location: "template-" + timestamp.toString() + "-tiny.png",
        created_on: timestamp
    }

    let result = await Templates.createTemplate(templateData, 'foo');

    expect(result.affectedRows).toBe(1);

    // clean up
    const templateId = result.insertId;
    await Templates.deleteTemplate(templateId);
});

/**
 * Broken path - create a template (missing parameters)
 *
 **/
test('template-lib - create a template (missing parameters)', async () => {
    const timestamp = unixTimestamp();
    const templateData = {
        filename: null,
        filetype: "image/png",
        storage_location: "template-" + timestamp.toString() + "-tiny.png",
        created_on: timestamp
    }

    try {
        let result = await Templates.createTemplate(templateData, 'foo');
    } catch (e) {
        expect(e).toBeDefined();
    }
});


/**
 * Happy path - find a template we know exists
 *
 **/
test('template-lib - get a template by filename', async () => {
    let result = await Templates.getTemplateByFilename('tiny.gif');
    expect(result[0].filename).toBe('tiny.gif');
});


/**
 * Happy path - find a template we know exists by id
 *
 **/
test('template-lib - get a template by id', async () => {
    let result = await Templates.getTemplateById(templateId);
    expect(result[0].filename).toBe('tiny.gif');
});


/**
 * Happy path - find a template we know exists by carbone hash (carbone_id)
 *
 **/
test('template-lib - get a template by hash', async () => {
    let result = await Templates.getTemplateByHash('3e28bed1bf184741b8055575708a82ca');
    expect(result[0].filename).toBe('tiny.gif');
});


/**
 * Happy path - get all templates
 */
test('template-lib - get all templates', async () => {
    let result = await Templates.getAllTemplates()
    expect(result.length).toBeGreaterThan(0);
});


/**
 * Happy path - get all templates count
 *
 **/
test('template-lib - get all templates', async () => {
    let result = await Templates.getAllTemplatesCount()
    expect(result[0].templatesCount).toBeGreaterThan(0);
});


/**
 * Happy path - update a template
 *
 **/
test('template-lib - update a template', async () => {
    let result = await Templates.updateTemplate(templateId, {carbone_id: '3e28bed1-bf18-4741-b805-5575708a82ca'});
    expect(result[0].carbone_id).toBe('3e28bed1-bf18-4741-b805-5575708a82ca');
});

/**
 * Broken path - update a template no id passed
 *
 **/
test('template-lib - update a template no id passed', async () => {
    try {
        let result = await Templates.updateTemplate(null, {carbone_id: '3e28bed1-bf18-4741-b805-5575708a82ca'});
    } catch (e) {
        expect(e).toBeDefined();
    }
});


/**
 * Happy path - update a template (filename)
 *
 **/
test('template-lib - update a template (filename)', async () => {
    let result = await Templates.updateTemplate(templateId, {filename: 'new_name.xlsx'});
    expect(result[0].filename).toBe('new_name.xlsx');
});


/**
 * Happy path - update a template (storage_location)
 *
 **/
test('template-lib - update a template (storage_location)', async () => {
    let result = await Templates.updateTemplate(templateId, {storage_location: 'updated value'});
    expect(result[0].storage_location).toBe('updated value');
});


/**
 * Happy path - update a template (carbone_id)
 *
 **/
test('template-lib - update a template (carbone_id)', async () => {
    let result = await Templates.updateTemplate(templateId, {carbone_id: '3e28bed1-bf18-4741-b805-5575708a82ca'});
    expect(result[0].carbone_id).toBe('3e28bed1-bf18-4741-b805-5575708a82ca');
});


/**
 * Happy path - update a template (filetype)
 *
 **/
test('template-lib - update a template (filetype)', async () => {
    let result = await Templates.updateTemplate(templateId, {filetype: 'image/jpg'});
    expect(result[0].filetype).toBe('image/jpg');
});


/**
 * Happy path - update a template (private_status)
 *
 **/
test('template-lib - update a template (private_status)', async () => {
    let result = await Templates.updateTemplate(templateId, {private_status: 1});
    expect(result[0].private_status).toBe(1);
});


/**
 * Happy path - update a template (strict)
 *
 **/
test('template-lib - update a template (strict)', async () => {
    let result = await Templates.updateTemplate(templateId, {strict: 1});
    expect(result[0].strict).toBe(1);
});

