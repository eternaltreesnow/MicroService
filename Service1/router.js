'use strict'

const Express = require('express');
const http = require('http');
const Request = require('request');
const Logger = require('./log/logger');
const Define = require('./define');

const service = require('./control/service');
const session = require('./control/session');

let KeyDefine = new Define();

let router = Express.Router();

function authenticate(req, res, callback) {
    // 初始化并获取cookie中的sessionId
    let sessionId = '';
    if(req.signedCookies['connect.sid']) {
        sessionId = req.signedCookies['connect.sid'];
        Logger.console('Auth: ' + sessionId);
    } else {
        Logger.console('Auth: Null session id');
    }

    // 将sessionId请求到verify接口进行验证
    let request = http.get('http://localhost:10000/verify?sessionId=' + sessionId, (response) => {
        response.setEncoding('utf8');
        console.log(response.statusCode);
        response.on('data', (data) => {
            data = JSON.parse(data);
            console.log(data);
            if(data.code === KeyDefine.RESULT_SUCCESS) {
                Logger.console('Verify successfully');
                if(session.set(data.data) === KeyDefine.RESULT_SUCCESS) {
                    callback(req, res);
                }
            } else if(data.code === KeyDefine.RESULT_REDIRECT) {
                Logger.console('Verify failed');
                res.redirect(data.url + '?src=http://' + req.headers.host);
            } else {
                res.end(JSON.stringify(data));
            }
        });
    }).on('error', (e) => {
        console.log(e);
    });
}

router.get('/', (req, res) => {
    authenticate(req, res, service.demo);
});

router.get('/session', (req, res) => {
    let sessionId = req.query.sessionId;
    res.send(session.check(sessionId));
    res.end();
});

router.get('/test', (req, res) => {
    Request('http://localhost:10000/test1', function(err, response, body) {
        console.log(response.statusCode);
        res.sendStatus(response.statusCode);
        res.end();
    });
});

router.get('/test1', (req, res) => {
    console.log('test1');
    res.sendStatus('200');
    res.end();
});

module.exports = router;
