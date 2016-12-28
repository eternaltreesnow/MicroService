'use strict'

const Express = require('express');
const login = require('./control/login');
const register = require('./control/register');
const verify = require('./control/verify');

let router = Express.Router();

router.post('/login', login.login);

router.get('/login', login.loginView);

// router.post('/register', register);

router.get('/verify', verify.verify);

router.get('/test1', (req, res) => {
    console.log('test1');
    res.send('200');
    res.end();
});

module.exports = router;
