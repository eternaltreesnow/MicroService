'use strict'

const Express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
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

app.use(session({
    secret: 'ecg-cloud',
    store: new redisStore({
        host: '54.187.245.212',
        port: 6379,
        pass: 'ecg-cloud',
        prefix: 'session:'
    })
}));

app.use(morgan('dev'));

// initial logger file
Logger.init();

app.get('/', function(req, res) {
    if(req.session.isVisit) {
        req.session.isVisit++;
        res.send('欢迎第' + req.session.isVisit + '次访问该页面');
    } else {
        req.session.isVisit = 1;
        res.send('欢迎第一次访问');
        console.log(req.session);
    }
});

const server = app.listen('10000', () => {
    Logger.console('Auth server listening on: ' + server.address().port);
});
