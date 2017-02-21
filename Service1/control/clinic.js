'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const multer = require('../util/multer-util');
const Session = require('../util/session');

const clinicModel = require('../model/clinic');
const contractModel = require('../model/contract');

let KeyDefine = new Define();

let Clinic = {};

Clinic.getClinic = function(clinicId) {
    let defer = Q.defer();
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Control: Unknowed error',
        data: null
    };

    if(!clinicId) {
        result.desc = 'Clinic Control: Null clinicId';
        defer.resolve(result);
    } else {
        clinicModel.get(clinicId)
            .then(clinicResult => {
                result.code = clinicResult.code;
                result.desc = clinicResult.desc;
                if(clinicResult.code === KeyDefine.RESULT_SUCCESS) {
                    result.data = clinicResult.data;
                }
                defer.resolve(result);
            }, error => {
                Logger.console(error);
                result.desc = 'Clinic Model Error';
                defer.resolve(result);
            });
    }
    return defer.promise;
};

Clinic.setClinic = function(clinic) {
    let defer = Q.defer();
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Control: Unknowed error',
    };

    if(!clinic) {
        result.desc = 'Clinic Control: Empty Clinic';
        defer.resolve(result);
    } else {
        clinicModel.set(clinic)
            .then(clinicResult => {
                Logger.console(clinicResult);
                result.code = clinicResult.code;
                result.desc = clinicResult.desc;
                defer.resolve(result);
            }, error => {
                Logger.console(error);
                result.desc = 'Clinic Model Error';
                defer.resolve(result);
            });
    }

    return defer.promise;
};

/**
 * 新建检查单
 * @param {Object} req 请求
 * @param {Object} res 响应
 */
Clinic.addClinic = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    Logger.console(userData);

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Control: Unknowed error',
        data: null
    };

    // 上传心电数据文件并重命名
    let upload = multer('ecg-file').single('ecg-file');
    upload(req, res, (err) => {
        if(err) {
            Logger.console(err);
            res.send(err);
        }
        // 根据契约获取合伙人id
        contractModel.getPartnerId(userData.userId)
            .then(contractResult => {
                if(contractResult.code === KeyDefine.RESULT_SUCCESS) {
                    let partnerId = contractResult.data.partnerId;

                    // 设置clinic数据
                    let clinic = {
                        patientId: req.body.patientId,
                        partnerId: partnerId,
                        addTime: Date.now(),
                        file: req.file.filename,
                        hospitalId: userData.userId,
                        state: 2
                    };
                    // 新建检查单
                    return clinicModel.add(clinic);
                } else {
                    // 契约数据出错时手动跳出promise链
                    result.desc = 'Contract data error';
                    Logger.console(contractResult.desc);
                    res.send(result);
                    throw new Error('Abort promise chain');
                    return null;
                }
            })
            .then(clinicResult => {
                Logger.console(clinicResult);
                result.code = clinicResult.code;
                result.desc = clinicResult.desc;
                if(clinicResult.code === KeyDefine.RESULT_SUCCESS) {
                    result.data = clinicResult.data;
                }
                res.send(result);
            })
            .catch(error => {
                if(error.message === 'Abort promise chain') {
                    // 手动跳出promise链
                } else {
                    Logger.console(error);
                    result.desc = 'Clinic data error';
                    res.send(result);
                }
            });
    });
};

Clinic.getClinicList = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    let hospitalId;
    if(userData) {
        hospitalId = userData.userId;
    }

    let draw = req.query.draw;
    let start = req.query.start;
    let length = req.query.length;
    let state = req.query.state;

    if(state == 0) {
        state = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    let result = {
        status: KeyDefine.RESULT_SUCCESS,
        draw: draw,
        data: [],
        recordsFiltered: 0
    };

    clinicModel.count(hospitalId, state)
        .then(countResult => {
            result.recordsFiltered = countResult.data;
            return clinicModel.getList(hospitalId, state, start, length);
        })
        .then(clinicResult => {
            result.data = clinicResult.data;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

module.exports = Clinic;
