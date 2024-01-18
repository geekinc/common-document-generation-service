const { armpit, armpitCount } = require('../controllers/armpit.controller.js');
const { login, logout } = require('../controllers/auth.controller.js');
const { apolloSearch } = require('../controllers/apollo.controller.js');
const express = require('express');

const router = express.Router()

router.get('/armpit', armpit)
router.get('/armpit/:count', armpitCount)
router.post('/login', login)
router.post('/logout', logout)
router.get('/apollo', apolloSearch);

module.exports = router
