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
