import { success, failure, response } from "../../lib/response-lib.cjs";

test('response-lib - instantiate objects', async () => {
    let result;
    // --- Success ---
    result = success({test: 'test'});
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('{"test":"test"}');

    result = success("test", false);
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("test");

    // --- Failure ---
    result = failure({test: 'test'});
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('{"test":"test"}');

    result = failure("test", false);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe("test");

    // --- Response.success ---
    result = response.success({test: 'test'});
    expect(result.statusCode).toBe(200);

    // --- Response.bad_request ---
    result = response.bad_request({test: 'test'});
    expect(result.statusCode).toBe(400);

    // --- Response.unauthorized ---
    result = response.unauthorized({test: 'test'});
    expect(result.statusCode).toBe(401);

    // --- Response.not_found ---
    result = response.not_found({test: 'test'});
    expect(result.statusCode).toBe(404);

    // --- Response.redirect ---
    result = response.redirect({test: 'test'});
    expect(result.statusCode).toBe(302);

    // --- Response.svg_success ---
    result = response.svg_success(`
        <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="black" stroke-width="4" fill="green" />
        </svg>`.trim());
    expect(result.statusCode).toBe(200);

    // --- Response.svg_failure ---
    result = response.svg_failure(`
        <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="black" stroke-width="4" fill="red" />
        </svg>`.trim());
    expect(result.statusCode).toBe(500);

    // --- Response.raw_success ---
    result = response.raw_success('test');
    expect(result.statusCode).toBe(200);

    // --- Response.raw_failure ---
    result = response.raw_failure('test');
    expect(result.statusCode).toBe(500);

    // --- Response.raw_bad_request ---
    result = response.raw_bad_request('test');
    expect(result.statusCode).toBe(400);

    // --- Response.raw_unauthorized ---
    result = response.raw_unauthorized('test');
    expect(result.statusCode).toBe(401);

    // --- Response.raw_not_found ---
    result = response.raw_not_found('test');
    expect(result.statusCode).toBe(404);

});
