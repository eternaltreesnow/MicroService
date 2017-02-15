'use strict'

const Express = require('express');
const Request = require('request');
const login = require('./control/login');
const verify = require('./control/verify');
const serviceAuth = require('./control/service/auth');
const serviceVerify = require('./control/service/verify');

let router = Express.Router();

router.post('/login', login.login);

router.get('/login', login.loginView);

router.post('/service/auth', serviceAuth.auth);

router.get('/service/auth', serviceAuth.authView);

router.get('/verify', verify.verify);

router.get('/service/verify', serviceVerify.verify);

module.exports = router;
