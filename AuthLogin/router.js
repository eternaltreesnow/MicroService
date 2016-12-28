'use strict'

const Express = require('express');
const Request = require('request');
const login = require('./control/login');
const register = require('./control/register');
const verify = require('./control/verify');

let router = Express.Router();

router.post('/login', login.login);

router.get('/login', login.loginView);

// router.post('/register', register);

router.get('/verify', verify.verify);

router.get('/test1', (req, res) => {
    console.log(req.headers);
    res.send();
});

router.get('/test', (req, res) => {
    Request('http://localhost:10002/test1', function(err, response, body) {
        if(err) {
            console.log('BODY: ');
            console.log(body);
            console.log('RESPONSE: ');
            console.log(response);
            console.log('ERROR: ');
            console.log(err);
            res.send(err);
            res.end();
        } else {
            console.log(response.statusCode);
            res.sendStatus(response.statusCode);
            res.end();
        }
    });
});

module.exports = router;
