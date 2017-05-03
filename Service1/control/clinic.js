'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Uri = require('../util/uri');
const multer = require('../util/multer-util');
const Session = require('../util/session');
const Agent = require('../util/agent');

const clinicModel = require('../model/clinic');
const contractModel = require('../model/contract');
const censorModel = require('../model/censor');

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

    Logger.console(req.body.patientId);

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
                    Logger.console(clinic);
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

    let result = {
        status: KeyDefine.RESULT_SUCCESS,
        draw: draw,
        data: [],
        recordsFiltered: 0
    };

    let condition;
    // state = 3: 待拉取检查单
    if(state == 3) {
        let method = 'GET';
        let uri = Uri.TeamManage + '/getPartnerId';
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
            } else {
                res.send(result);
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
        let uri = Uri.TeamManage + '/getTeamId';
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
            } else {
                res.send(result);
            }
        });
    // state = 6(2): 重审检查单
    } else if(state == 62) {
        let condition = {
            doctorId: doctorId,
            state: 6
        };
        Clinic.getClinicList(condition, draw, start, length, res);
    } else if(state == 0) {
        let condition = {
            doctorId: doctorId,
            state: [2, 3, 4, 5, 6, 7, 8, 9]
        };
        Clinic.getClinicList(condition, draw, start, length, res);
    }
};

// 获取技师相关的检查单数据列表
Clinic.getTechList = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    let techId;
    if(userData) {
        techId = userData.userId;
    }

    let draw = req.query.draw;
    let start = req.query.start;
    let length = req.query.length;
    let state = req.query.state;

    let result = {
        status: KeyDefine.RESULT_SUCCESS,
        draw: draw,
        data: [],
        recordsFiltered: 0
    };

    let condition;
    // state = 3: 待拉取检查单
    if(state == 3) {
        let method = 'GET';
        let uri = Uri.TeamManage + '/getPartnerId';
        let param = {
            "userId": techId
        };
        Agent.request(method, uri, param, function(data) {
            if(data.code === KeyDefine.RESULT_SUCCESS) {
                let condition = {
                    'partnerId': data.data,
                    'state': [2,3]
                };
                Clinic.getClinicList(condition, draw, start, length, res);
            } else {
                res.send(result);
            }
        });
    // state = 5: 技师分析中的检查单
    } else if(state == 5) {
        let condition = {
            'techId': techId,
            'state': 5
        };
        Clinic.getClinicList(condition, draw, start, length, res);
    // state = 7: 重分析检查单
    } else if(state == 7) {
        let condition = {
            'techId': techId,
            'state': 7
        };
        Clinic.getClinicList(condition, draw, start, length, res);
    // state = 6: 已完成检查单
    } else if(state == 62) {
        let condition = {
            'techId': techId,
            'state': [6, 9]
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
};

Clinic.uploadReport = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    Logger.console(userData);

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Clinic Report: Unknowed error'
    };

    // 上传心电报告文件并重命名
    let upload = multer('report').single('ecg-report');
    upload(req, res, (err) => {
        if(err) {
            Logger.console(err);
            result.desc = 'Clinic Report: File upload failed';
            res.send(result);
        } else {
            let clinic;
            let clinicId = req.body.id;
            if(userData.roleId == 1) {
                clinic = {
                    state: 9,
                    reportTime: Date.now(),
                    report: req.file.filename
                };
            } else if(userData.roleId == 2) {
                clinic = {
                    state: 6,
                    reportTime: Date.now(),
                    report: req.file.filename
                };
            }
            clinicModel.set(clinicId, clinic)
                .then(clinicResult => {
                    Logger.console(clinicResult);
                    result.code = clinicResult.code;
                    result.desc = clinicResult.desc;
                    res.send(result);
                }, error => {
                    Logger.console(error);
                    result.desc = 'Clinic Report: update data failed';
                    res.send(result);
                });
        }
    });
};

Clinic.occupyClinic = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    Logger.console(userData);

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Occupy Clinic: Unknowed error'
    };

    // 获取参数
    let clinicId = req.body.id;
    let userId = userData.userId;
    let clinic;

    // 获取teamId
    let method = 'GET';
    let uri = Uri.TeamManage + '/getTeamId';
    let param = {
        "userId": userId
    };
    Agent.request(method, uri, param, function(data) {
        if(data.code === KeyDefine.RESULT_SUCCESS) {
            // 构造model调用参数
            let teamId = data.data;
            if(userData.roleId == 1) {
                clinic = {
                    doctorId: userId,
                    teamId: teamId,
                    state: 4
                };
            } else if(userData.roleId == 2) {
                clinic = {
                    techId: userId,
                    teamId: teamId,
                    state: 5
                };
            }
            clinicModel.set(clinicId, clinic)
                .then(clinicResult => {
                    Logger.console(clinicResult);
                    result.code = clinicResult.code;
                    result.desc = clinicResult.desc;
                    res.send(result);
                }, error => {
                    Logger.console(error);
                    result.desc = 'Occupy Clinic: Update data failed';
                    res.send(result);
                });
        } else {
            result.desc = 'Occupy Clinic: Get TeamId failed';
            res.send(result);
        }
    });
};

// 审核检查单
Clinic.censorClinic = (req, res) => {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    Logger.console(userData);

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Censor Clinic: Unknowed error'
    };

    let userId = userData.userId;
    let clinicId = req.body.id;
    let censorOption = req.body.censorOption;
    let errorType = req.body.errorType;
    let feedback = req.body.feedback;

    let clinic;
    let censor;
    if(censorOption == 1) {
        clinic = {
            doctorId: userId,
            state: 9,
            reportTime: Date.now()
        };
    } else {
        clinic = {
            doctorId: userId,
            state: 7
        };
        censor = {
            clinicId: clinicId,
            doctorId: userId,
            errorType: errorType,
            feedback: feedback,
            censorTime: Date.now()
        };
    }
    clinicModel.set(clinicId, clinic)
        .then(clinicResult => {
            Logger.console(clinicResult);
            if(clinicResult.code === KeyDefine.RESULT_SUCCESS && censorOption != 1) {
                result.code = clinicResult.code;
                return censorModel.add(censor);
            } else {
                result.code = clinicResult.code;
                result.desc = clinicResult.desc;
                res.send(result);
                throw new Error('Abort promise chain');
                return null;
            }
        })
        .then(censorResult => {
            result.desc = censorResult.desc;
            res.send(result);
        })
        .catch(error => {
            if(error.message === 'Abort promise chain') {
                // 手动跳出promise链
            } else {
                Logger.console(error);
                result.desc = 'Censor Clinic: Update data failed';
                res.send(result);
            }
        });
};

module.exports = Clinic;
