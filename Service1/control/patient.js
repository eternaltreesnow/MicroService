'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');

const patientModel = require('../model/patient');

let KeyDefine = new Define();

let Patient = {};

/**
 * 添加病人
 * @param {Object} req 请求
 * @param {Object} res 响应
 */
Patient.addPatient = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    Logger.console(userData);
    let hospitalId = 0;
    if(userData) {
        hospitalId = userData.userId;
    }

    let result = {
        code: KeyDefine.RESULT_FAILED,
        desc: 'Patient Control: Unknowed error',
        data: null
    };

    let patient = {
        hospitalId: hospitalId,
        name: req.body.name,
        idCode: req.body.idCode,
        gender: req.body.gender,
        birth: 724896000000,
        height: req.body.height || 0,
        weight: req.body.weight || 0,
        medicareNum: req.body.medicareNum,
        telephone: req.body.telephone,
        address: req.body.address,
        remark: req.body.remark,
        wardNum: req.body.wardNum || 0,
        bedNum: req.body.bedNum || 0,
        patientNum: req.body.patientNum
    };

    Logger.console(patient);

    patientModel.add(patient)
        .then(patientResult => {
            Logger.console(patientResult);
            result.code = patientResult.code;
            result.desc = patientResult.desc;
            if(patientResult.code === KeyDefine.RESULT_SUCCESS) {
                result.data = patientResult.data;
            }
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

/**
 * 编辑病人信息
 * @param {Object} req 请求
 * @param {Object} res 响应
 */
Patient.editPatient = function(req, res) {

};

/**
 * 获取病人列表
 * @param {Object} req 请求
 * @param {Object} res 响应
 */
Patient.getPatientList = function(req, res) {
    // 获取session中的用户数据
    let userData = Session.getUserData(req);
    let hospitalId;
    if(userData) {
        hospitalId = userData.userId;
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

    patientModel.count(hospitalId)
        .then(countResult => {
            result.recordsFiltered = countResult.data;
            return patientModel.getPatientList(hospitalId, start, length);
        })
        .then(patientResult => {
            result.data = patientResult.data;
            res.send(result);
        })
        .catch(error => {
            Logger.console(error);
            res.send(result);
        });
};

module.exports = Patient;
