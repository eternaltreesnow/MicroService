'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');

const clinicModel = require('../model/clinic');
const teamModel = require('../model/Clinic');

let KeyDefine = new Define();

let Clinic = {};

// 检查单列表页
Clinic.clinicManage = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/clinicManage', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 未完成检查单
Clinic.unfinishedClinic = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/unfinishedClinic', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 已完成检查单
Clinic.finishedClinic = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/finishedClinic', {
        realName: userData.realName,
        userId: userData.userId
    });
};

// 新建检查单
Clinic.addClinic = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/addClinic', {
        realName: userData.realName,
        userId: userData.userId
    });
};

module.exports = Clinic;
