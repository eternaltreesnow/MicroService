'use strict'

const Q = require('q');
const Logger = require('../../util/logger');
const Define = require('../../util/define');
const authModel = require('../../model/service/auth');
const tokenControl = require('./token');
const session = require('../session');

let KeyDefine = new Define();

let Auth = {};

Auth.auth = function(req, res) {
    let name = req.body.name;
    let password = req.body.password;

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Auth Service: Unknowed error',
        data: null
    };

    // 检查name和密码
    authModel.checkParam(name, password)
        .then(checkResult => {
            Logger.console(checkResult.desc);
            if(checkResult.code === KeyDefine.RESULT_SUCCESS) {
                // 授权请求
                return authModel.auth(name, password);
            } else {
                result.desc = 'Auth Service: Invalid Param';
                res.end(JSON.stringify(result));
            }
        })
        .then(authResult => {
            Logger.console(authResult.desc);
            if(authResult.code === KeyDefine.RESULT_SUCCESS) {
                tokenControl.generateToken(authResult.data.name, function(tokenResult) {
                    if(tokenResult.code === KeyDefine.RESULT_SUCCESS) {
                        result.desc = 'Auth Service: Auth Success';
                        result.code = KeyDefine.RESULT_SUCCESS;
                        result.data = tokenResult.data;
                    } else {
                        result.desc = 'Auth Service: Token generate failed';
                    }
                    res.end(JSON.stringify(result));
                });
            } else {
                result.desc = 'Auth Service: Auth failed';
                res.end(JSON.stringify(result));
            }
        })
        .catch(error => {
            result.desc = error;
            res.end(JSON.stringify(result));
        });
};

Auth.authView = function(req, res) {
    res.render('../view/service/auth');
};

module.exports = Auth;
