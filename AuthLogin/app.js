'use strict'

const Express = require('express');
const router = require('./router');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Logger = require('./util/logger');
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
        logger.error('This is OSX/Linux, you may need to use "sudo" prefix to start server.\n');
    }

    logger.error(e && e.stack);
})

const server = app.listen('10001', () => {
    Logger.console('Auth server listening on: ' + server.address().port);
});
