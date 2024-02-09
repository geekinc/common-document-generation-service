import { dao } from "./dao-mysql-lib.cjs";
import { logger } from "./logger-lib.js";
process.env.LOG_LEVEL = 'off';

export default class Templates {

    static async getTemplateByFilename(filename)  {
        try {
            return await dao.run("SELECT * FROM template WHERE filename = ?", [filename]);
        } catch (e)  /* istanbul ignore next */ {
            await logger.error(e);
            throw new Error('Database error');
        }
    }

    static async getTemplateById(id)  {
        try {
            return await dao.run("SELECT * FROM template WHERE id = ?", [id]);
        } catch (e)  /* istanbul ignore next */ {
            await logger.error(e);
            throw new Error('Database error');
        }
    }

    static getAllTemplates = async () => {
        try {
            return await dao.run('SELECT * FROM template', []);
        } catch (e) /* istanbul ignore next */ {
            await logger.error(e);
            throw new Error('Database error');
        }
    }

    static getAllTemplatesCount = async () => {
        try {
            return await dao.run('SELECT count(*) as templatesCount FROM template', []);
        } catch (e) /* istanbul ignore next */ {
            await logger.error(e);
            throw new Error('Database error');
        }
    }

    static createTemplate = async (fields, created_by) => {
        let result;

        // Fetch the data from the fields object
        const { filename, storage_location, carbone_id, filetype, private_status, strict } = fields;

        // Check parameters
        if (!filename || !storage_location) {
            throw new Error('Missing parameters');
        }

        try {
            // Insert base template record
            result = await dao.run(
                'INSERT INTO template (filename, storage_location, created_by) VALUES (?, ?, ?)',
                [filename, storage_location, created_by]
            );
        } catch (e)  /* istanbul ignore next */ {
            await logger.error(e);
            throw new Error('Database error');
        }

        return result;
    }

    static updateTemplate = async (id, fields) => {
        // Check parameters
        if (!id) {
            throw new Error('Missing id parameter');
        }

        // Fetch the data from the fields object
        const { filename, storage_location, carbone_id, filetype, private_status, strict } = fields;

        // if the optional fields are present, execute the query
        if (filename) {
            try {
                await dao.run('UPDATE template SET filename = ? WHERE id = ?', [filename, id]);
            } catch (e)  /* istanbul ignore next */ {
                await logger.error(e);
                throw new Error('Database error');
            }
        }

        if (storage_location) {
            try {
                await dao.run('UPDATE template SET storage_location = ? WHERE id = ?', [storage_location, id]);
            } catch (e)  /* istanbul ignore next */ {
                await logger.error(e);
                throw new Error('Database error');
            }
        }

        if (carbone_id) {
            try {
                await dao.run('UPDATE template SET carbone_id = ? WHERE id = ?', [carbone_id, id]);
            } catch (e)  /* istanbul ignore next */ {
                await logger.error(e);
                throw new Error('Database error');
            }
        }

        if (filetype) {
            try {
                await dao.run('UPDATE template SET filetype = ? WHERE id = ?', [filetype, id]);
            } catch (e)  /* istanbul ignore next */ {
                await logger.error(e);
                throw new Error('Database error');
            }
        }

        if (private_status) {
            try {
                await dao.run('UPDATE template SET private_status = ? WHERE id = ?', [private_status, id]);
            } catch (e)  /* istanbul ignore next */ {
                await logger.error(e);
                throw new Error('Database error');
            }
        }

        if (strict) {
            try {
                await dao.run('UPDATE template SET strict = ? WHERE id = ?', [strict, id]);
            } catch (e)  /* istanbul ignore next */ {
                await logger.error(e);
                throw new Error('Database error');
            }
        }

        try {
            return await dao.run('SELECT * FROM template WHERE id = ?', [id]);
        } catch (e)  /* istanbul ignore next */ {
            await logger.error(e);
            throw new Error('Database error');
        }
    }

    static deleteTemplate = async (id) => {
        try {
            return await dao.run('DELETE FROM template WHERE id = ?', [id]);
        } catch (e)  /* istanbul ignore next */ {
            await logger.error(e);
            throw new Error('Database error');
        }
    }

}