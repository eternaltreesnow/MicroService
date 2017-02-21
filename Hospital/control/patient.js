'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const clinicModel = require('../model/clinic');
const patientModel = require('../model/patient');

let KeyDefine = new Define();

let Patient = {};

// 病人管理页
Patient.patientManage = function(req, res) {
    res.render('patient/patientManage');
};

// 添加病人页
Patient.addPatient = function(req, res) {
    res.render('patient/addPatient');
};

// 编辑病人页
Patient.editPatient = function(req, res) {
    res.render('patient/editPatient');
};

// 删除病人
Patient.deletePatient = function(req, res) {

};

module.exports = Patient;
