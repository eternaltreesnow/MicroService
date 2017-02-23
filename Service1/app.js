'use strict'

const Express = require('express');
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

app.use(morgan('dev'));

process.on('uncaughtException', function(e) {
    if (/\blisten EACCES\b/.test(e.message) && (serverOS.isOSX || serverOS.isLinux)) {
        Logger.console('This is OSX/Linux, you may need to use "sudo" prefix to start server.\n');
    }

    Logger.console(e && e.stack);
});

const origin = 'http://localhost:10001,'
             + 'http://localhost:10002,'
             + 'http://localhost:10003,'
             + 'http://localhost:10004,'
             + 'http://localhost:10005,'
             + 'http://localhost:10006,'
             + 'http://localhost:10007,'
             + 'http://localhost:10008';
// 设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:10005");
    res.header("Access-Control-Allow-Headers", "*, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use('/', router);

// 初始化serviceName
session.set('serviceName', 'ClinicManage', 30 * 24 * 60 * 60 * 1000);
session.set('password', 'root', 30 * 24 * 60 * 60 * 1000);

const server = app.listen('10002', () => {
    Logger.console('Clinic Manage listening on: ' + server.address().port);
});
