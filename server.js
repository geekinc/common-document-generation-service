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

const port = 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
