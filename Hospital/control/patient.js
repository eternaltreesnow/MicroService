'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');
const clinicModel = require('../model/clinic');
const patientModel = require('../model/patient');

let KeyDefine = new Define();

let Patient = {};

// 病人管理页
Patient.patientManage = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('patient/patientManage', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 添加病人页
Patient.addPatient = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('patient/addPatient', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 编辑病人页
Patient.editPatient = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('patient/editPatient', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 删除病人
Patient.deletePatient = function(req, res) {

};

module.exports = Patient;
