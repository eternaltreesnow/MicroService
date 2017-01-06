'use strict'

const Q = require('q');
const Logger = require('../../util/logger');
const Define = require('../../util/define');

let KeyDefine = new Define();
let RoleType = KeyDefine.ROLE_TYPE;

// 验证状态条件
let authState = (clinicData, actionData) => {
    if(clinicData.state !== actionData.preState) {
        return false;
    } else {
        return true;
    }
};

// 验证角色权限条件
let authPermission = (actionData, userData) => {
    let permission = actionData.permission;
    let roleId = userData.role;
    // 权限条件为0, 则无角色权限限制
    if(permission === RoleType.none) {
        return true;
    // 权限条件与用户角色相同, 则验证通过
    } else if(permission === roleId) {
        return true;
    // 权限条件与用户角色不同, 则验证不通过
    } else {
        return false;
    }
};

// 验证负责人条件
let authCharge = (clinicData, actionData, userData) => {
    let chargeType = actionData.chargeType;
    let userId = userData.userId;
    let chargeId;
    // 负责人类型为空, 则无负责人条件控制
    if(chargeType === RoleType.none) {
        return true;
    } else {
        // 根据负责人类型, 获取检查单对应负责人id
        switch(chargeType) {
            case RoleType.hospital:
                chargeId = clinicData.hospitalId;
                break;
            case RoleType.doctor:
                chargeId = clinicData.doctorId;
                break;
            case RoleType.technician:
                chargeId = clinicData.techId;
                break;
            // 负责人类型不匹配, 返回错误
            default:
                Logger.console('Invalid chargeType');
                return false;
        }
        if(chargeId && chargeId === userId) {
            return true;
        } else {
            return false;
        }
    }
};

module.exports = function(clinicData, actionData, userData) {
    let defer = Q.defer();
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Action Auth: Unknowed error'
    };
    // 验证数据为空
    if(!clinicData || !actionData || !userData) {
        Logger.console('Null data');
        result.desc = 'Action Auth: Null data';
    } else if(!this.authState(clinicData, actionData)) {
        Logger.console('State not match');
        result.desc = 'Action Auth: State not match';
    } else if(!this.authPermission(actionData, userData)) {
        Logger.console('Invalid Permission');
        result.desc = 'Action Auth: Invalid Permission';
    } else if(!this.authCharge(clinicData, actionData, userData)) {
        Logger.console('Invalid Charge');
        result.desc = 'Action Auth: Invalid Charge';
    } else {
        result.code = KeyDefine.RESULT_SUCCESS;
        result.desc = 'Action Auth: Valid condition';
    }
    defer.resolve(result);

    return defer.promise;
};
