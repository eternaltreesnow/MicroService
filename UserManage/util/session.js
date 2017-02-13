'use strict'

const Q = require('q');
const Logger = require('./logger');
const Define = require('./define');
const Cache = require('./cache')();

let KeyDefine = new Define();

let Session = {};

// 验证session的有效性和操作的合法性
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

Session.set = function(session) {
    let code = KeyDefine.RESULT_FAILED;
    let sessionId = session.sessionId;
    let sessionData = session.sessionData;
    if(Cache.set(sessionId, sessionData)) {
        code = KeyDefine.RESULT_SUCCESS;
    }
    Logger.console('Session: ' + sessionId + ': ' + Cache.get(sessionId));
    return code;
};

module.exports = Session;
