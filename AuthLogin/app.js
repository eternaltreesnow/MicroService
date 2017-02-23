'use strict'

const Express = require('express');
const router = require('./router');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Logger = require('./util/logger');
const serverOS = require('./util/isWindows');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);

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

// initial session store config
app.use(session({
    secret: 'ecg-cloud',
    store: new redisStore({
        host: '54.187.245.212',
        port: 6379,
        pass: 'ecg-cloud',
        prefix: 'session:'
    }),
    cookie: {
        maxAge: 20 * 60 * 1000 // 过期时间(ms)
    }
}));

app.use(morgan('dev'));

app.use('/', router);

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
    res.header("Access-Control-Allow-Origin", 'http://localhost:10003');
    res.header("Access-Control-Allow-Headers", "*, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const server = app.listen('10001', () => {
    Logger.console('Auth server listening on: ' + server.address().port);
});
