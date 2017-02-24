'use strict'
/**
 * 本地Cache验证方法
 * @Author: dickzheng
 * @Date: 2017/02/16
 */

const Logger = require('./logger');
const Define = require('./define');
const Cache = require('./cache')();

let KeyDefine = new Define();

let Session = {};

/**
 * 验证用户session的有效性和操作的合法性
 * @param  {String} sessionId 键
 * @param  {String} operation 请求操作
 * @return {Number}           验证结果状态码
 */
Session.validate = function(sessionId, operation) {
    let result = KeyDefine.VALID_EMPTY_CACHE;
    let userData = JSON.parse(Cache.get(sessionId));

    if(userData) {
        // 操作为空则默认合法
        if(operation === '') {
            result = KeyDefine.VALID_SUCCESS;
        } else {
            // 验证成功条件：session存在 & 操作合法
            if(userData.operation instanceof Array && userData.operation.length > 0 && userData.operation.indexOf(operation) >= 0) {
                result = KeyDefine.VALID_SUCCESS;
            } else {
                result = KeyDefine.VALID_INVALID_OPERATION;
            }
        }
    }
    return result;
};

/**
 * 验证服务session的有效性
 * @param  {String} serviceName 服务名称
 * @param  {String} accessToken 服务授权令牌
 * @return {Number}             验证结果状态码
 */
Session.validateService = function(serviceName, accessToken) {
    let result = KeyDefine.VALID_EMPTY_CACHE;

    let sessionData = JSON.parse(Cache.get(serviceName));
    let timestamp = +new Date();

    Logger.console('Session Validate: sessionData: ' + JSON.stringify(sessionData));

    if(sessionData) {
        if(sessionData.accessToken !== accessToken) {
            Logger.console('Session Validate: Invalid Token');
            result = KeyDefine.VALID_INVALID_SERVICE;
        } else if(sessionData.ttl < timestamp) {
            Logger.console('Session Validate: Expired Token');
            result = KeyDefine.VALID_INVALID_SERVICE;
        } else {
            // 验证成功条件：令牌存在，令牌有效
            Logger.console('Session Validate: Validate Successfully');
            result = KeyDefine.VALID_SUCCESS;
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
    Logger.console('Session: ' + sessionId + ': ' + JSON.stringify(Cache.get(sessionId)));
    return code;
};

// 获取Cache中的用户数据
Session.getUserData = function(req) {
    let sessionId = req.signedCookies['connect.sid'];
    let userData = null;
    if(sessionId && sessionId.length > 0) {
        userData = Cache.get(sessionId);
        if(userData !== null) {
            return JSON.parse(userData);
        }
    }
    return userData;
}

module.exports = Session;
