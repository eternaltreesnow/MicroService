'use strict'

const Express = require('express');
const login = require('./control/login');
const register = require('./control/register');
const verify = require('./control/verify');

let router = Express.Router();

router.post('/login', login);

router.post('/register', register);

router.get('/verify', verify);

module.exports = router;
