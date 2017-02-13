'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');

const userModel = require('../model/user');

let KeyDefine = new Define();

let User = {};

User.addUser = function(req, res) {

};

// 启用用户
// status => 1
User.startUser = function(req, res) {
    let userId = req.body.id;

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error'
    };

    User.modifyStatus(userId, 1)
        .then(modifyResult => {
            Logger.console(modifyResult.desc);
            result.code = modifyResult.code;
            result.desc = modifyResult.desc;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

// 停用用户
// status => 2
User.stopUser = function(req, res) {
    let userId = req.body.id;

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error'
    };

    User.modifyStatus(userId, 2)
        .then(modifyResult => {
            Logger.console(modifyResult.desc);
            result.code = modifyResult.code;
            result.desc = modifyResult.desc;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

// 删除用户
// status => 3
User.delUser = function(req, res) {
    let userId = req.body.id;

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error'
    };

    User.modifyStatus(userId, 3)
        .then(modifyResult => {
            Logger.console(modifyResult.desc);
            result.code = modifyResult.code;
            result.desc = modifyResult.desc;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

// 修改用户状态
// status {
//      1: '启用',
//      2: '停用',
//      3: '删除'
// }
User.modifyStatus = function(userId, status) {
    let defer = Q.defer();
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Unknowed error',
    };

    if(!userId || !status) {
        Logger.console('Empty params');
        result.desc = 'Empty params';
        defer.resolve(result);
    } else {
        userModel.modifyStatus(userId, status)
            .then(userResult => {
                result.code = userResult.code;
                result.desc = userResult.desc;
                defer.resolve(result);
            }, error => {
                Logger.console(error);
                result.desc = 'Model error';
                defer.reject(result);
            });
    }
    return defer.promise;
};

module.exports = User;
