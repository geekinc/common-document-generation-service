export const promise = async (event, context) => {
    return Promise.resolve(await callback(event, context, (value)  => { return 'armpit' + '/' + value; }));
};

export const callback = (event, context, cb) => {
    // Assign some value to pass through to the callback
    return cb('oxter');
};
