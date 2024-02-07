const { Event, Context, Request, Response } = require('../../lib/serverless-lib.js');
process.env.LOG_LEVEL = 'off';

test('serverless-lib - instantiate objects', async () => {
    const event = new Event();
    const context = new Context();
    const request = new Request();
    const response = new Response();

    // Set up method checks
    // --- Event ---
    event.headers = {
        'Content-Type': 'application/json',
    };
    let eventHeader = event.header('Content-Type');
    expect(event.body).toStrictEqual({});
    expect(eventHeader).toStrictEqual('application/json');

    // --- Context ---
    expect(context.functionName).toStrictEqual('test');

    // --- Request ---
    request.headers = {
        'Content-Type': 'application/json',
    };
    let requestHeader = request.header('Content-Type');
    expect(requestHeader).toStrictEqual('application/json');

    // --- Response ---
    response.json('{"oxter": "armpit"}');
    expect(response.data).toStrictEqual({'oxter': 'armpit'});

    response.send({message: "test"});
    expect(response.data.message).toStrictEqual('test');

    response.status(400);
    expect(response.statusCode).toStrictEqual(400);

    response.json('{oxter: "armpit"}');  // Invalid JSON
    expect(response.data).toStrictEqual({'error': 'Unexpected token o in JSON at position 1'});

});
