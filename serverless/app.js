const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const staticData = require('../data/response.json')

const app = express();
app.use(cors());
app.use(express.json());

// app.post('/api/search', async (req, res) => {
//     console.log(req.body);
//     try {
//         const response = await axios.post('https://api.apollo.io/v1/mixed_people/search', req.body);
//         res.send(response.data);
//     } catch (error) {
//         console.error(`Error: ${error}`);
//         res.status(500).send('There was an error processing your request');
//     }
// });

app.post('/api/local-search/', async (req, res) => {
    console.log(req.body);

    // Call upsert function to save the query server-side
    try {
        const response = await axios.post('http://localhost:3000/dev/api/local-upsert-query', req.body);
        // res.send(response.data);
        console.log(response.data);
        // Return static results
        await res.send(staticData);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('There was an error processing your request');
    }


});

app.post('/api/local-upsert-query', async (req, res) => {
    console.log('upsert customer query');

    // This method should store the customer query
    // The reasoning is this: if there is a current query, the system can continue to execute it in the background
    // and rehydrate the prospect list for that particular customer on a regular basis

    res.send({'result': 'processing', 'customer': req.body.customer});
});



app.get('/api/apollo', async (req, res) => {
    console.log(req.body);
    try {
        const response = await axios.get('https://app.apollo.io/api/v1/auth/login?email=ben@geekinc.ca&password=%26p7%2AMdQZ%25-w%2B%2Bu%21');
        res.send(response.data);
        console.log(response);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('There was an error processing your request');
    }
});

app.get('/api/armpit', async (req, res) => {
    console.log('oxter');
    console.log(req.params);
    try {
        res.send('oxter');
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('There was an error processing your request');
    }
});

app.get('/api/armpit/:count', async (req, res) => {
    console.log('oxter');
    console.log(req.params);
    try {
        res.send('oxter');
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('There was an error processing your request');
    }
});

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
    // console.log(`EVENT: ${JSON.stringify(event)}`);
    awsServerlessExpress.proxy(server, event, context);
};
