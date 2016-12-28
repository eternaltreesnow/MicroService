'use strict'

const Q = require('q');
const Logger = require('../log/logger');
const Define = require('../define');
const Cache = require('./cache')();

let KeyDefine = new Define();

let Session = {};

Session.check = function(sessionId) {
    let result = KeyDefine.RESULT_FAILED;
    if(Cache.get(sessionId)) {
        result = KeyDefine.RESULT_SUCCESS;
    } else {

    }
    return result;
};

Session.set = function(session) {
    let code = KeyDefine.RESULT_FAILED;
    let sessionId = session.sessionId
    let sessionData = session.sessionData;
    if(Cache.set(sessionId, sessionData)) {
        Logger.console('Session Cache: ' + sessionId + ': ' + sessionData);
        code = KeyDefine.RESULT_SUCCESS;
    }
    return code;
};

module.exports = Session;
