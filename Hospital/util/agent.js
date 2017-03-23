'use strict'
/**
 * 请求代理Frame
 * @Target: 用于Service之间请求的授权与验证
 * @Author: dickzheng
 * @Date: 2017/02/16
 */

const http = require('http');
const Request = require('request');
const querystring = require('querystring');
const Logger = require('./logger');
const Define = require('./define');
const Uri = require('./uri');
const Cache = require('./cache')();
const session = require('./session');

let KeyDefine = new Define();

let Agent = {};

/**
 * 代理发送请求
 * @param  {String}   method   请求类型: 'GET', 'POST', 'DELETE'
 * @param  {String}   uri      请求资源uri
 * @param  {JSON}     params   参数
 * @param  {Function} callback 回调函数
 */
Agent.request = function(method, uri, params, callback) {
    let result = {
        code: KeyDefine.SERVER_AGENT_FAILED
    };

    // 获取验证参数
    let serviceName = Cache.get('serviceName');
    let accessToken = Cache.get('accessToken');

    // 合并参数
    params['service_name'] = serviceName;
    params['access_token'] = accessToken;

    // 处理GET请求
    if(method === 'GET') {
        // 参数序列化
        let query_params = querystring.stringify(params);

        Request(uri + '?' + query_params, function(error, res, body) {
            if(!error && res.statusCode == 200) {
                let info = JSON.parse(body);
                // 验证失败，则执行授权方法
                if(info.code === KeyDefine.VALID_INVALID_SERVICE) {
                    Agent.auth(function(tag) {
                        // 授权成功，则重新发送该请求
                        if(tag) {
                            Agent.request(method, uri, params, callback);
                        // 授权失败，则返回失败状态码
                        } else {
                            result.code = KeyDefine.VALID_INVALID_SERVICE;
                            callback(result);
                        }
                    });
                // 验证成功，则返回数据
                } else {
                    callback(info);
                }
            } else {
                Logger.console('Agent Req: Http Request error');
                Logger.console(error);
                callback(result);
            }
        });
    } else {
        let options = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            uri: uri,
            method: method,
            body: params
        };
        Request(options, function(error, res, body) {
            if(!error && res.statusCode == 200) {
                let info = JSON.parse(body);
                Logger.console(info);
            }
        });
    }
};

/**
 * 服务授权
 * @Target: 通过获取服务请求方的serviceName和password到AuthLogin服务进行授权
 * @param  {Function} callback 回调函数
 */
Agent.auth = function(callback) {
    let serviceName = Cache.get('serviceName');
    let password = Cache.get('password');

    // 获取授权参数
    let param = querystring.stringify({
        name: serviceName,
        password: password
    });

    // POST请求option
    let options = {
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        uri: Uri.AuthLogin + '/service/auth',
        body: param
    };

    Request(options, function(error, res, body) {
        if(!error && res.statusCode == 200) {
            let info = JSON.parse(body);
            // 授权成功，将token写入Cache
            if(info.code === KeyDefine.RESULT_SUCCESS) {
                let accessToken = info.data.accessToken;
                session.set('accessToken', accessToken);
                Logger.console('Agent Auth: Service auth success');
                callback(true);
            // 授权失败，执行失败方法
            } else {
                Logger.console('Agent Auth: Service auth failed');
                callback(false);
            }
        } else {
            Logger.console('Agent Auth: Http Request error');
            Logger.console(error);
            callback(false);
        }
    });
};

module.exports = Agent;
