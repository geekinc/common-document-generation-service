const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/search', async (req, res) => {
    console.log(req.body);
    try {
        const response = await axios.post('https://api.apollo.io/v1/mixed_people/search', req.body);
        res.send(response.data);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('There was an error processing your request');
    }
});


app.post('/api/fetch_all', async (req, res) => {
    console.log(req.body);
    try {
        // Need to set up a call to a queue to start the processing of the data


        const response = await axios.post('https://api.apollo.io/v1/mixed_people/search', req.body);
        res.send(response.data);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('There was an error processing your request');
    }
});


app.get('/api/apollo', async (req, res) => {
    // console.log(req.body);
    try {
        const response = await axios.get('https://app.apollo.io/api/v1/auth/login?email=ben@geekinc.ca&password=%26p7%2AMdQZ%25-w%2B%2Bu%21');
        res.send(response.headers['set-cookie']);
        console.log(response.headers['set-cookie']);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send('There was an error processing your request');
    }
});


const port = 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
