'use strict'

const Express = require('express');
const http = require('http');
const Request = require('request');
const Logger = require('./log/logger');
const Define = require('./define');

const service = require('./control/service');
const session = require('./control/session');
const Cache = require('./control/cache')();

let KeyDefine = new Define();

let router = Express.Router();

function authenticate(req, res, callback) {
    // 初始化并获取cookie中的sessionId
    let sessionId = '';
    if(req.signedCookies['connect.sid']) {
        sessionId = req.signedCookies['connect.sid'];
        Logger.console('Auth: ' + sessionId);

        // 本地cache进行验证
        if(Cache.get(sessionId)) {
            Logger.console('Auth: Cache get');
            callback(req,res);
        } else {
            // 将sessionId请求到verify接口进行验证
            let request = http.get('http://localhost:10001/verify?sessionId=' + sessionId, (response) => {
                response.setEncoding('utf8');
                response.on('data', (data) => {
                    data = JSON.parse(data);
                    if(data.code === KeyDefine.RESULT_SUCCESS) {
                        Logger.console('Auth: Verify successfully');
                        if(session.set(data.data) === KeyDefine.RESULT_SUCCESS) {
                            callback(req, res);
                        }
                    } else if(data.code === KeyDefine.RESULT_REDIRECT) {
                        Logger.console('Auth: Verify failed');
                        res.redirect(data.url + '?src=http://' + req.headers.host);
                    } else {
                        res.end(JSON.stringify(data));
                    }
                });
            }).on('error', (e) => {
                console.log(e);
            });
        }
    } else {
        // 空sessionId直接跳转登录
        Logger.console('Auth: Null session id');
        res.redirect('http://localhost:10001/login' + '?src=http://' + req.headers.host);
    }
}

router.get('/', (req, res) => {
    authenticate(req, res, service.demo);
});

router.get('/session', (req, res) => {
    let sessionId = req.query.sessionId;
    res.send(session.check(sessionId));
    res.end();
});

module.exports = router;
