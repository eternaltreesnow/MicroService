'use strict'

const http = require('http');
const Express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./router');
const morgan = require('morgan');
const Logger = require('./log/logger');

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// use cookie parser
app.use(cookieParser('ecg-cloud'));

app.use(morgan('dev'));

app.use('/', router);

const server = app.listen('10001', () => {
    Logger.console('Service 1 listening on: ' + server.address().port);
});
