module.exports = async () => {
    console.log('API url set: ', process.env.API_URL);
    require('dotenv').config();
};
