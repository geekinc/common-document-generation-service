import Joi from "joi";
const { Event, Context } = require('../../lib/serverless-lib.js');
const { main } = require('../../controllers/dao-controller.js');

test('dao - test simple query', async () => {
    let result = await main.query("SHOW GLOBAL STATUS LIKE 'Uptime'");

    // Parse the result
    let body = JSON.parse(result.body);

    // Check the response for the expected error
    expect(Number(body[0]['Value'])).toBeGreaterThan(0);
});


test('dao - test simple query', async () => {
    let result = await main.query("SHOW GLOBAL STATUS LIKE 'Uptime'");

    // Parse the result
    let body = JSON.parse(result.body);

    // Check the response for the expected error
    expect(Number(body[0]['Value'])).toBeGreaterThan(0);
});


test('dao - test failing query', async () => {
    let result = await main.query("SELECT * FROM non_existent_table");

    // Parse the result
    let body = JSON.parse(result.body);

    // Check the response for the expected error
    expect(body.code).toBe('ER_NO_SUCH_TABLE');
});


test('dao - get users', async () => {
    let event = new Event();
    let context = new Context();

    // Define the schema of the user object
    const userSchema = Joi.object({
        id: Joi
            .number()
            .description("User ID")
            .required(),
        username: Joi
            .string()
            .description("Username"),
        password: Joi
            .string()
            .description("Password"),
        role: Joi
            .string()
            .valid("USER", "ADMIN")
            .description("Role"),
        firstname: Joi
            .any()
            .description("First name"),
        lastname: Joi
            .any()
            .description("Last name"),
    });

    // Define the schema of the result object
    const resultSchema = Joi.array().items(userSchema);

    // Call our method
    let result = await main.get_users(event, context);

    // Validate the result
    let {error, value} = await resultSchema.validate(JSON.parse(result.body));

    // Check the response
    expect(error).toBe(undefined);
    expect(value).not.toBe(undefined);
    expect(value.length).toBeGreaterThan(0);
    expect(value[0].id).toBeGreaterThan(0);
    expect(value[0].id).toBe(1);
    expect(value[0].username).toBe("foo");
});
