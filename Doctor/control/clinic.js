'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const clinicModel = require('../model/clinic');
const teamModel = require('../model/Clinic');
const Session = require('../util/session');

let KeyDefine = new Define();

let Clinic = {};

// 分析任务列表页
Clinic.analysisTask = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/analysisTask', {
        username: userData.username,
        userId: userData.userId
    });
};

// 所有任务页
Clinic.taskManage = function(req, res) {
    res.render('clinic/taskManage');
};

// 待审核任务列表页
Clinic.censorTask = function(req, res) {
    res.render('clinic/censorTask');
};

// 待审核任务详情页
Clinic.censorDetail = function(req, res) {
    res.render('clinic/censorDetail');
};

module.exports = Clinic;
