const { armpit, armpitCount } = require('../controllers/armpit.controller');
const { login, logout } = require('../controllers/auth.controller');
const { apolloSearch } = require('../controllers/apollo.controller');
const express = require('express');

const router = express.Router()

router.get('/armpit', armpit)
router.get('/armpit/:count', armpitCount)
router.post('/login', login)
router.post('/logout', logout)
router.get('/apollo', apolloSearch);

module.exports = router
