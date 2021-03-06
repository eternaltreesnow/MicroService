'use strict'

const Express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./router');
const morgan = require('morgan');
const Logger = require('./util/logger');
const session = require('./util/session');

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// use cookie parser
app.use(cookieParser('ecg-cloud'));

// use jade as view template engine
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(Express.static('public'));

app.use(morgan('dev'));

process.on('uncaughtException', function(e) {
    if (/\blisten EACCES\b/.test(e.message) && (serverOS.isOSX || serverOS.isLinux)) {
        Logger.console('This is OSX/Linux, you may need to use "sudo" prefix to start server.\n');
    }

    Logger.console(e && e.stack);
});

app.use('/', router);

// 初始化serviceName
session.set('serviceName', 'HospitalCli', 30 * 24 * 60 * 60 * 1000);
session.set('password', 'root', 30 * 24 * 60 * 60 * 1000);

const server = app.listen('10007', () => {
    Logger.console('Hospital Client listening on: ' + server.address().port);
});
