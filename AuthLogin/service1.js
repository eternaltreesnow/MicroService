'use strict'

const http = require('http');
const Express = require('express');
const cookieParser = require('cookie-parser');
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

app.get('/', function(req, res) {
    // 初始化并获取cookie中的sessionId
    let sessionId = '';
    if(req.signedCookies['connect.sid']) {
        sessionId = req.signedCookies['connect.sid'];
        Logger.console(sessionId);
    } else {
        Logger.console('Null session id');
    }

    // 将sessionId请求到verify接口进行验证
    let request = http.get('http://localhost:10000/verify?sessionId=' + sessionId, (response) => {
        response.setEncoding('utf8');
        response.on('data', (data) => {
            data = JSON.parse(data);
            if(data.code === 200) {
                Logger.console('Verify successfully');
                res.send('service 1');
                res.end();
            } else {
                Logger.console('Verify failed');
                res.redirect(data.url + '?src=http://localhost:10001');
            }
        });
    }).on('error', (e) => {
        console.log(e);
    });
});

const server = app.listen('10001', () => {
    Logger.console('Service 1 listening on: ' + server.address().port);
});
