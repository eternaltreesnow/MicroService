'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const multer = require('../util/multer-util');
const Session = require('../util/session');
const Agent = require('../util/agent');

const clinicModel = require('../model/clinic');
const contractModel = require('../model/contract');

let KeyDefine = new Define();

let Clinic = {};

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

Clinic.getClinic = function(req, res) {
    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Service: Get Clinic data failed',
        data: null
    };

    let clinicId = req.query.clinicId;
    let state = req.query.state;

    clinicModel.get(clinicId, state)
        .then(clinicResult => {
            result.code = clinicResult.code;
            result.desc = clinicResult.desc;
            result.data = clinicResult.data;
            res.send(result);
        }, error => {
            Logger.console(error);
            res.send(result);
        });
}

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

// 获取基层医院相关的检查单数据列表
Clinic.getHospList = function(req, res) {
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

    let condition = {
        hospitalId: hospitalId,
        state: state
    };

    Clinic.getClinicList(condition, draw, start, length, res);
};

// 获取医生相关的检查单数据列表
Clinic.getDocList = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    let doctorId;
    if(userData) {
        doctorId = userData.userId;
    }

    let draw = req.query.draw;
    let start = req.query.start;
    let length = req.query.length;
    let state = req.query.state;

    let condition;
    // state = 3: 待拉取检查单
    if(state == 3) {
        let method = 'GET';
        let uri = KeyDefine.TeamManageUri + '/doc/getPartnerId';
        let param = {
            "userId": doctorId
        };
        Agent.request(method, uri, param, function(data) {
            if(data.code === KeyDefine.RESULT_SUCCESS) {
                let condition = {
                    'partnerId': data.data,
                    'state': [2,3]
                };
                Clinic.getClinicList(condition, draw, start, length, res);
            }
        });
    // state = 4: 医生分析中的检查单
    } else if(state == 4) {
        let condition = {
            'doctorId': doctorId,
            'state': 4
        };
        Clinic.getClinicList(condition, draw, start, length, res);
    // state = 6(1): 初审检查单
    } else if(state == 61) {
        let method = 'GET';
        let uri = KeyDefine.TeamManageUri + '/doc/getTeamId';
        let param = {
            "userId": doctorId
        };
        Agent.request(method, uri, param, function(data) {
            if(data.code === KeyDefine.RESULT_SUCCESS) {
                let condition = {
                    teamId: data.data,
                    doctorId: 0,
                    state: 6
                };
                Clinic.getClinicList(condition, draw, start, length, res);
            }
        });
    // state = 6(2): 重审检查单
    } else if(state == 62) {
        let condition = {
            doctorId: doctorId,
            state: 6
        };
        Clinic.getClinicList(condition, draw, start, length, res);
    }
};

Clinic.getClinicList = function(condition, draw, start, length, res) {
    let result = {
        status: KeyDefine.RESULT_SUCCESS,
        draw: draw,
        data: [],
        recordsFiltered: 0
    };

    clinicModel.count(condition)
        .then(countResult => {
            result.recordsFiltered = countResult.data;
            return clinicModel.getList(condition, start, length);
        })
        .then(clinicResult => {
            result.data = clinicResult.data;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
}

module.exports = Clinic;
