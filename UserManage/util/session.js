'use strict'

const Q = require('q');
const Logger = require('./logger');
const Define = require('./define');
const Cache = require('./cache')();

let KeyDefine = new Define();

let Session = {};

// 验证用户session的有效性和操作的合法性
Session.validate = function(sessionId, operation) {
    let result = KeyDefine.VALID_EMPTY_CACHE;
    let userData = JSON.parse(Cache.get(sessionId));

    if(userData) {
        if(userData.operation instanceof Array && userData.operation.length > 0 && userData.operation.indexOf(operation) >= 0) {
            result = KeyDefine.VALID_SUCCESS;
        } else {
            result = KeyDefine.VALID_INVALID_OPERATION;
        }
    }
    return result;
};

// 验证服务session的有效性
Session.validateService = function(serviceName, accessToken) {
    let result = KeyDefine.VALID_EMPTY_CACHE;
    let sessionData = JSON.parse(Cache.get(serviceName));
    let timestamp = +new Date();

    Logger.console('Session Validate: sessionData: ' + sessionData);

    if(sessionData) {
        if(sessionData.accessToken === accessToken && sessionData.ttl >= timestamp) {
            result = KeyDefine.VALID_SUCCESS;
        } else {
            result = KeyDefine.VALID_INVALID_SERVICE;
        }
    }
    return result;
};

// 设置session
Session.set = function(sessionId, sessionData) {
    let code = KeyDefine.RESULT_FAILED;
    if(Cache.set(sessionId, sessionData)) {
        code = KeyDefine.RESULT_SUCCESS;
    }
    Logger.console('Session: ' + sessionId + ': ' + Cache.get(sessionId));
    return code;
};

module.exports = Session;
