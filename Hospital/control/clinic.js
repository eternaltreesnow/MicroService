'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const clinicModel = require('../model/clinic');
const teamModel = require('../model/Clinic');

let KeyDefine = new Define();

let Clinic = {};

// 检查单列表页
Clinic.clinicManage = function(req, res) {
    res.render('clinic/clinicManage');
};

// 未完成检查单
Clinic.unfinishedClinic = function(req, res) {
    res.render('clinic/unfinishedClinic');
};

// 已完成检查单
Clinic.finishedClinic = function(req, res) {
    res.render('clinic/finishedClinic');
};

// 新建检查单
Clinic.addClinic = function(req, res) {
    res.render('clinic/addClinic');
};

module.exports = Clinic;
