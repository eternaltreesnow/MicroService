'use strict'

const Q = require('q');
const Logger = require('../../util/logger');
const Define = require('../../util/define');
const Md5 = require('md5');
const tokenModel = require('../../model/service/token');

let KeyDefine = new Define();

let Token = {};

Token.generateToken = function(serviceName, callback) {
    serviceName = serviceName || '';

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Service Token: Unknowed error',
        data: null
    };

    if(serviceName === '') {
        result.desc = 'Service Token: Empty serviceName';
        callback(result);
    } else {
        let timestamp = +new Date();
        let accessToken = Md5(serviceName + '' + timestamp);
        let ttl = timestamp + 3 * 60 * 1000;
        tokenModel.generate(serviceName, accessToken, ttl)
            .then(tokenResult => {
                if(tokenResult.code === KeyDefine.RESULT_SUCCESS) {
                    result.code = KeyDefine.RESULT_SUCCESS;
                    result.desc = 'Generate Token Success';
                    result.data = tokenResult.data;
                }
                callback(result);
            }, error => {
                Logger.console(error);
                result.desc = error;
                callback(result);
            });
    }
};

module.exports = Token;
