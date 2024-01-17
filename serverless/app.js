const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const Auth  = require('./lib/auth.lib');
const cors = require('cors');

const publicRoutes = require('./routes/public.routes');

const app = express();
app.use(Auth.authMiddleware);
app.use(cors());
app.use(express.json());

// Route definitions are in the routes folder
app.use('/api/', publicRoutes);

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
    // console.log(`EVENT: ${JSON.stringify(event)}`);
    awsServerlessExpress.proxy(server, event, context);
};
