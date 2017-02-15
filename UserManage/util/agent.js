'use strict'

const http = require('http');
const querystring = require('querystring');
const Logger = require('./logger');
const Define = require('./define');
const Cache = require('./cache')();
const session = require('./session');

let KeyDefine = new Define();

let Agent = {};

/**
 * 代理发送请求
 * @param  {String}   method   请求类型: 'GET', 'POST', 'DELETE'
 * @param  {JSON}     uri      请求资源uri: host, port, path
 * @param  {JSON}     params   参数
 * @param  {Function} callback 回调函数
 */
Agent.request = function(method, uri, params, callback) {
    let result = {
        code: KeyDefine.SERVER_AGENT_FAILED
    };

    let serviceName = Cache.get('serviceName');
    let accessToken = Cache.get('accessToken');

    params['service_name'] = serviceName;
    params['access_token'] = accessToken;

    let req_params = querystring.stringify(params);

    let options = {
        host: uri.host,
        port: uri.port,
        path: uri.path,
        method: method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(params)
        }
    };

    Logger.console('Params: ' + JSON.stringify(params));

    let agentReq = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(data) {
            data = JSON.parse(data);
            if(data.code === KeyDefine.VALID_INVALID_SERVICE) {
                Agent.auth(function(tag) {
                    Logger.console(tag);
                    if(tag) {
                        Agent.request(method, uri, params, callback);
                    } else {
                        result.code = KeyDefine.VALID_INVALID_SERVICE;
                        callback(result);
                    }
                });
            } else {
                callback(data);
            }
        });
    })
    .on('error', function(err) {
        Logger.console('Agent Req: Http Request error');
        Logger.console(err);
        callback(result);
    });

    agentReq.write(req_params);
    agentReq.end();
};

Agent.auth = function(callback) {
    let serviceName = Cache.get('serviceName');
    let password = Cache.get('password');

    let param = querystring.stringify({
        name: serviceName,
        password: password
    });

    let options = {
        host: 'localhost',
        port: 10001,
        path: '/service/auth',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(param)
        }
    };

    let authReq = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(data) {
            data = JSON.parse(data);
            if(data.code === KeyDefine.RESULT_SUCCESS) {
                let accessToken = JSON.stringify(data.data);
                session.set(serviceName, accessToken);
                Logger.console('Agent Auth: Service auth success');
                callback(true);
            } else {
                Logger.console('Agent Auth: Service auth failed');
                callback(false);
            }
        });
    })
    .on('error', function(err) {
        Logger.console('Agent Auth: Http Request error');
        Logger.console(err);
        callback(false);
    });

    authReq.write(param);
    authReq.end();
};

module.exports = Agent;
