'use strict'

const http = require('http');
const Logger = require('./logger');
const Define = require('./define');
const Cache = require('./cache')();
const session = require('./session');

const authLoginAddr = 'http://localhost:10001/';

const authUrl = {
    login: authLoginAddr + 'login',
    verify: authLoginAddr + 'verify',
    serviceAuth: authLoginAddr + 'service/auth',
    serviceVerify: authLoginAddr + 'service/verify'
};

let KeyDefine = new Define();

let Auth = {};

Auth.auth = function(req, res, operation, callback) {
    // 初始化并获取cookie中的sessionId
    let sessionId = '';
    if(req.signedCookies['connect.sid']) {
        sessionId = req.signedCookies['connect.sid'];
        Logger.console('SessionId: ' + sessionId);

        // 本地cache进行验证与操作的合法性
        let validation = session.validate(sessionId, operation);
        if(validation === KeyDefine.VALID_SUCCESS) {
            callback(req, res);
        } else if(validation === KeyDefine.VALID_INVALID_OPERATION) {
            res.send('Invalid Operation');
        } else {
            // 将sessionId请求到verify接口进行验证
            let request = http.get(authUrl.verify + '?sessionId=' + sessionId, (response) => {
                response.setEncoding('utf8');
                response.on('data', (data) => {
                    data = JSON.parse(data);
                    if(data.code === KeyDefine.RESULT_SUCCESS) {
                        Logger.console('Verify successfully');
                        if(session.set(data.data.sessionId, data.data.sessionData) === KeyDefine.RESULT_SUCCESS) {
                            // 本地cache进行验证与操作的合法性
                            validation = session.validate(data.data.sessionId, operation);
                            if(validation === KeyDefine.VALID_SUCCESS) {
                                callback(req, res);
                            } else if(validation === KeyDefine.VALID_INVALID_OPERATION) {
                                res.send('Invalid Operation');
                            }
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
};

/**
 * 验证服务访问的合法性
 * @param  {Object}   req      请求
 * @param  {Object}   res      响应
 * @param  {Function} callback 执行函数
 * @return {Object}            验证结果
 */
Auth.authService = function(req, res, callback) {
    let failedResult = {
        code: KeyDefine.VALID_INVALID_SERVICE,
        desc: 'Invalid Service access',
        url: ''
    };

    // 获取REST请求的参数
    let serviceName, accessToken;
    if(req.method === 'GET') {
        serviceName = req.query.service_name;
        accessToken = req.query.access_token;
    } else if(req.method === 'POST' || req.method === 'DELETE') {
        serviceName = req.body.service_name;
        accessToken = req.body.access_token;
    } else {
        serviceName = req.param('service_name') || '';
        accessToken = req.param('access_token') || '';
    }

    Logger.console('Service Auth Params: serviceName = ' + serviceName + ', accessToken = ' + accessToken);

    let validation = session.validateService(serviceName, accessToken);
    if(validation === KeyDefine.VALID_SUCCESS) {
        callback(req, res);
    } else {
        // 将serviceName和accessToken请求到verify接口进行验证
        let request = http.get(authUrl.serviceVerify + '?service_name=' + serviceName + '&access_token=' + accessToken, (response) => {
            response.setEncoding('utf8');
            response.on('data', (data) => {
                data = JSON.parse(data);
                if(data.code === KeyDefine.RESULT_SUCCESS) {
                    Logger.console('Service verify successfully');
                    session.set(data.data.serviceName, data.data);
                    callback(req, res);
                } else {
                    failedResult.url = data.url;
                    res.send(failedResult);
                }
            });
        }).on('error', (e) => {
            Logger.console(e);
        });
    }
};

module.exports = Auth;
