'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session= require('../util/session');

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

User.getHospList = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    let partnerId;
    if(userData) {
        partnerId = userData.userId;
    }

    let draw = req.query.draw;
    let start = req.query.start;
    let length = req.query.length;

    let result = {
        status: KeyDefine.RESULT_SUCCESS,
        draw: draw,
        data: [],
        recordsFiltered: 0
    };

    userModel.hospCount(partnerId)
        .then(countResult => {
            result.recordsFiltered = countResult.data;
            return userModel.getHospList(partnerId, start, length);
        })
        .then(userResult => {
            result.data = userResult.data;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

User.addContract = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    let partnerId;
    if(userData) {
        partnerId = userData.userId;
    }

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'User Control: Unknowed error',
        data: null
    };

    let user = {
        username: req.body.username,
        password: req.body.password,
        realName: req.body.realName,
        grade: req.body.grade,
        level: req.body.level,
        chargeName: req.body.chargeName,
        idCode: req.body.idCode,
        telephone: req.body.telephone,
        address: req.body.address,
        email: req.body.email,
    }

    userModel.add(user)
        .then(userResult => {
            Logger.console(userResult);
            if(userResult.code === KeyDefine.RESULT_SUCCESS) {
                let contract = {
                    hospitalId: userResult.data,
                    partnerId: partnerId,
                    status: 1
                };
                return userModel.addContract(contract);
            } else {
                result.desc = 'User data error';
                Logger.console(userResult.desc);
                res.send(result);
                throw new Error('Abort promise chain');
                return null;
            }
        })
        .then(contractResult => {
            Logger.console(contractResult);
            result.code = contractResult.code;
            result.desc = contractResult.desc;
            res.send(result);
        })
        .catch(error => {
            if(error.message === 'Abort promise chain') {
                // 手动跳出promise链
            } else {
                Logger.console(error);
                result.desc = 'User data error';
                res.send(result);
            }
        });
};

module.exports = User;
