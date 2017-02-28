'use strict'
/**
 * 验证模块
 * @Target: 用于Service的用户身份验证和服务授权验证
 * @Author: dickzheng
 * @Date: 2017/02/16
 */

const http = require('http');
const Logger = require('./logger');
const Define = require('./define');
const Cache = require('./cache')();
const session = require('./session');
const Request = require('request');
const querystring = require('querystring');

let KeyDefine = new Define();

// 登录, 授权, 验证相关Uri
const authUrl = {
    login: KeyDefine.AuthLogin + '/login',
    verify: KeyDefine.AuthLogin + '/verify',
    serviceAuth: KeyDefine.AuthLogin + '/service/auth',
    serviceVerify: KeyDefine.AuthLogin + '/service/verify'
};

let Auth = {};

/**
 * 验证用户身份合法性
 * @param  {Object}   req       请求
 * @param  {Object}   res       响应
 * @param  {String}   operation 请求操作
 * @param  {Function} callback  回调函数
 */
Auth.auth = function(req, res, operation, callback) {
    // 初始化并获取cookie中的sessionId
    let sessionId = '';
    if(req.signedCookies['connect.sid']) {
        sessionId = req.signedCookies['connect.sid'];
        Logger.console('SessionId: ' + sessionId);

        // 本地Cache进行验证与操作的合法性
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
                            // 本地Cache进行验证与操作的合法性
                            validation = session.validate(data.data.sessionId, operation);
                            if(validation === KeyDefine.VALID_SUCCESS) {
                                callback(req, res);
                            } else if(validation === KeyDefine.VALID_INVALID_OPERATION) {
                                res.send('Invalid Operation');
                            }
                        }
                    } else if(data.code === KeyDefine.RESULT_REDIRECT) {
                        Logger.console('Verify failed');
                        res.redirect(data.url + '?src=' + escape('http://' + req.headers.host + req.url));
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
        res.redirect(authUrl.login + '?src=' + escape('http://' + req.headers.host + req.url));
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
        Logger.console('Auth Service: Method POST || DELETE');
        Logger.console(req.body);
        serviceName = req.body.service_name;
        accessToken = req.body.access_token;
    } else {
        Logger.console('Auth Service: Unknowed Method');
        serviceName = req.param('service_name') || '';
        accessToken = req.param('access_token') || '';
    }

    Logger.console('Service Auth Params: serviceName = ' + serviceName + ', accessToken = ' + accessToken);

    // 本地Cache进行验证
    let validation = session.validateService(serviceName, accessToken);
    if(validation === KeyDefine.VALID_SUCCESS) {
        callback(req, res);
    } else {
        // 将serviceName和accessToken请求到verify接口进行验证
        let query_params = querystring.stringify({
            service_name: serviceName,
            access_token: accessToken
        });

        Request(authUrl.serviceVerify + '?' + query_params, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                let data = JSON.parse(body);
                // 验证成功，将Service对应的Token写入Cache
                if(data.code === KeyDefine.RESULT_SUCCESS) {
                    Logger.console('Service verify successfully');
                    session.set(data.data.serviceName, JSON.stringify(data.data));
                    callback(req, res);
                // 验证失败，返回失败码
                } else {
                    Logger.console('Service verify failed');
                    failedResult.url = data.url;
                    res.send(failedResult);
                }
            } else {
                Logger.console(error);
                failedResult.desc = 'Verify error';
                res.send(failedResult);
            }
        });

        // let request = http.get(authUrl.serviceVerify + '?service_name=' + serviceName + '&access_token=' + accessToken, (response) => {
        //     response.setEncoding('utf8');
        //     response.on('data', (data) => {
        //         data = JSON.parse(data);
        //         // 验证成功，将Service对应的Token写入Cache
        //         if(data.code === KeyDefine.RESULT_SUCCESS) {
        //             Logger.console('Service verify successfully');
        //             session.set(data.data.serviceName, JSON.stringify(data.data));
        //             callback(req, res);
        //         // 验证失败，返回失败码
        //         } else {
        //             Logger.console('Service verify failed');
        //             failedResult.url = data.url;
        //             res.send(failedResult);
        //         }
        //     });
        // }).on('error', (e) => {
        //     Logger.console(e);
        // });
    }
};

module.exports = Auth;
