'use strict'

const http = require('http');
const Logger = require('./logger');
const Define = require('./define');
const Cache = require('./cache')();
const session = require('../control/session');

const authUrl = {
    login: 'http://localhost:10001/login',
    verify: 'http://localhost:10001/verify'
};

let KeyDefine = new Define();

let Auth = {};

Auth.auth = function(req, res, callback) {
    // 初始化并获取cookie中的sessionId
    let sessionId = '';
    if(req.signedCookies['connect.sid']) {
        sessionId = req.signedCookies['connect.sid'];
        Logger.console('SessionId: ' + sessionId);

        // 本地cache进行验证
        if(Cache.get(sessionId)) {
            Logger.console('Cache get');
            callback(req,res);
        } else {
            // 将sessionId请求到verify接口进行验证
            let request = http.get(authUrl.verify + '?sessionId=' + sessionId, (response) => {
                response.setEncoding('utf8');
                response.on('data', (data) => {
                    data = JSON.parse(data);
                    if(data.code === KeyDefine.RESULT_SUCCESS) {
                        Logger.console('Verify successfully');
                        if(session.set(data.data) === KeyDefine.RESULT_SUCCESS) {
                            callback(req, res);
                        }
                    } else if(data.code === KeyDefine.RESULT_REDIRECT) {
                        Logger.console('Verify failed');
                        res.redirect(data.url + '?src=http://' + req.headers.host + req.url);
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
        Logger.console('Null session id');
        res.redirect(authUrl.login + '?src=http://' + req.headers.host + req.url);
    }
}

module.exports = Auth;
