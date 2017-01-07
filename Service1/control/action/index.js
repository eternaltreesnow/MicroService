'use strict'

const Q = require('q');
const Logger = require('../../util/logger');
const Define = require('../../util/define');

const actionModel = require('../../model/action');
const clinicControl = require('../clinic');
const actionAuth = require('./auth');
const actionExecute = require('./execute');

let KeyDefine = new Define();

let Action = {};

Action.transfer = function(req, res) {
    let clinicId = req.body.clinicId;
    let actionName = req.body.actionName;
    let userId = req.signedCookies['connect.sid'];

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Action Transfer: Unknowed error',
        data: null
    };

    let clinicData;
    let actionData;
    let userData = Cache.get(userId); // 获取用户session数据

    // 获取检查单数据
    clinicControl.getClinic(clinicId)
        .then(clinicResult => {
            Logger.console(clinicResult);
            if(clinicResult.code === KeyDefine.RESULT_SUCCESS) {
                clinicData = clinicResult.data;
                // 调用Promise: 获取action数据
                return Action.getAction(actionName);
            }
            // 无检查单数据则返回
            else if(clinicResult.code === KeyDefine.RESULT_EMPTY) {
                result.code = clinicResult.code;
                result.desc = clinicResult.desc;
                res.send(result);
            } else {
                res.send(result);
            }
        }).catch(error => {
            Logger.console(error);
            result.desc = 'Clinic Control error';
            res.send(result);
        }).then(actionResult => {
            Logger.console(actionResult);
            if(actionResult.code === KeyDefine.RESULT_SUCCESS) {
                actionData = actionResult.data;
                // 调用Promise: 判断action执行的条件
                return actionAuth(clinicData, actionData, userData);
            }
            // 无action数据则返回
            else if(actionResult.code === KeyDefine.RESULT_EMPTY) {
                result.code = actionResult.code;
                result.desc = actionResult.desc;
                res.send(result);
            } else {
                res.send(result);
            }
        }).catch(error => {
            Logger.console(error);
            result.desc = 'Action Control error';
            res.send(result);
        }).then(authResult => {
            Logger.console(authResult);
            // 验证通过则执行action
            if(authResult.code === KeyDefine.RESULT_SUCCESS) {
                return actionExecute(clinicData, actionData, userData, req);
            }
            // 验证不通过则返回failed
            else {
                result.code = authResult.code;
                result.desc = authResult.desc;
                res.send(result);
            }
        }).then(executeResult => {
            Logger.console(executeResult);
            result.code = executeResult.code;
            result.desc = executeResult.desc;
            res.send(result);
        });
};

Action.getAction = function(actionName) {
    let defer = Q.defer();
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Action Control: Unknowed error',
        data: null
    };

    actionModel.get(actionName)
        .then(actionResult => {
            result.code = actionResult.code;
            result.desc = actionResult.desc;
            if(actionResult.code === KeyDefine.RESULT_SUCCESS) {
                result.data = actionResult.data;
            }
            defer.resolve(result);
        }, error => {
            Logger.console(error);
            result.desc = 'Action Model error';
            defer.reject(result);
        });
    return defer.promise;
};

module.exports = Action;
