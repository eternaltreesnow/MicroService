'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../define');
const sessionModel = require('../model/session');

let KeyDefine = new Define();

let Session = {};

Session.register = function(userData) {
    let defer = Q.defer();

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Session Control: Unknowed error'
    };

    sessionModel.register(userData)
        .then(registerResult => {
            if(registerResult.code === KeyDefine.RESULT_SUCCESS) {
                result.code = KeyDefine.RESULT_SUCCESS;
                result.desc = 'Session Control: Session created successfully';
                result.data = registerResult.data
                defer.resolve(result);
            } else {
                result.desc = 'Session Control: Session created failed';
                defer.reject(registerResult);
            }
        }, registerError => {
            Logger.console(registerError);
            defer.reject(registerError);
        });

    return defer.promise;
};

module.exports = Session;
