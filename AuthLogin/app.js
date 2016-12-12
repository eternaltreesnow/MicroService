'use strict'

const Express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Logger = require('./log/logger');

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan('dev'));

// initial logger file
Logger.init();

app.post('/login', (req, res) => {
    Logger.console('Request arrived: ' + req.body.username + ' ' + req.body.password);
    res.send('Login success');
});

app.post('/verify', (req, res) => {
    Logger.console('Request arrived: ' + req);
    res.send('Verify success');
});

const server = app.listen('10000', () => {
    Logger.console('Auth Login server listening on: ' + server.address().port);
});
