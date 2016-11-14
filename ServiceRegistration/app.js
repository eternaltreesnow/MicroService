'use strict'

const Express = require('express');
const router = require('./router');
const bodyParser = require('body-parser');
const Logger = require('./log/logger');
const morgan = require('morgan');

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use('/', router);

// initial logger
Logger.init();

const server = app.listen('33000', () => {
    Logger.console('Service Registration server listening on: ' + server.address().port);
});
