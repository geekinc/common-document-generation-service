const serverlessExpress = require('@codegenie/serverless-express');
const express = require('express');
const Auth  = require('./lib/auth.lib.js');
const cors = require('cors');

const publicRoutes = require('./routes/public.routes.js');

const app = express();
app.use(Auth.authMiddleware);
app.use(cors());
app.use(express.json());

// Route definitions are in the routes folder
app.use('/api/', publicRoutes);

let serverlessExpressInstance
// const server = serverlessExpress({ app });

function asyncTask () {
    return new Promise((resolve) => {
        setTimeout(() => resolve('Setup tasks complete'), 1000)  // mock out some async tasks
    })
}

async function setup (event, context) {
    const asyncValue = await asyncTask()
    console.log(asyncValue)
    serverlessExpressInstance = serverlessExpress({ app })
    return serverlessExpressInstance(event, context)
}

exports.handler = (event, context) => {
    // console.log(`EVENT: ${JSON.stringify(event)}`);
    // serverlessExpress.proxy(server, event, context);

    if (serverlessExpressInstance) return serverlessExpressInstance(event, context)

    return setup(event, context)
};
