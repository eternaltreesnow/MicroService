'use strict'

const Express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./router');
const bodyParser = require('body-parser');
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

// initial logger file
Logger.init();

const server = app.listen('10000', () => {
    Logger.console('Auth server listening on: ' + server.address().port);
});
