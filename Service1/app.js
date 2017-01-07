'use strict'

const Express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./router');
const morgan = require('morgan');
const Logger = require('./util/logger');

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// use cookie parser
app.use(cookieParser('ecg-cloud'));

// use jade as view template engine
app.set('view engine', 'jade');

app.use(morgan('dev'));

process.on('uncaughtException', function(e) {
    if (/\blisten EACCES\b/.test(e.message) && (serverOS.isOSX || serverOS.isLinux)) {
        Logger.console('This is OSX/Linux, you may need to use "sudo" prefix to start server.\n');
    }

    Logger.console(e && e.stack);
});

app.use('/', router);

const server = app.listen('10002', () => {
    Logger.console('Service 1 listening on: ' + server.address().port);
});
