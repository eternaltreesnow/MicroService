'use strict'

const Q = require('q');
const Define = require('../util/define');
const Logger = require('../util/logger');

let KeyDefine = new Define;

let sessionModel = {};

sessionModel.register = (userData) => {
    let defer = Q.defer();

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Session Model: Session generator error',
        data: null
    };

    let sessionData = {};

    sessionData['userId'] = userData.userId;
    sessionData['username'] = userData.username;
    sessionData['operation'] = userData.operation;

    result.code = KeyDefine.RESULT_SUCCESS;
    result.desc = 'Session Model: Session generator successfully';
    result.data = sessionData;

    defer.resolve(result);

    return defer.promise;
};

module.exports = sessionModel;
