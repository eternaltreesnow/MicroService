'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const Session = require('../util/session');
const clinicModel = require('../model/clinic');

let KeyDefine = new Define();

let Clinic = {};

// 可接任务列表页
Clinic.taskManage = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/taskManage', {
        username: userData.username,
        userId: userData.userId
    });
};

// 已接任务列表页
Clinic.occupiedTask = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/occupiedTask', {
        username: userData.username,
        userId: userData.userId
    });
};

// 重分析任务列表页
Clinic.reanalysisTask = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/reanalysisTask', {
        username: userData.username,
        userId: userData.userId
    });
};

// 已完成任务列表页
Clinic.finishedTask = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/finishedTask', {
        username: userData.username,
        userId: userData.userId
    });
};

// 分析任务详情页
Clinic.analysisTaskDetail = function(req, res) {
    let userData = Session.getUserData(req);
    let clinicId = req.query.id;
    let state = req.query.state;
    res.render('clinic/analysisTaskDetail', {
        username: userData.username,
        userId: userData.userId,
        clinicId: clinicId,
        state: state
    });
};

// 重分析任务详情页
Clinic.reanalysisTaskDetail = function(req, res) {
    let userData = Session.getUserData(req);
    let clinicId = req.query.id;
    let state = req.query.state;
    res.render('clinic/reanalysisTaskDetail', {
        username: userData.username,
        userId: userData.userId,
        clinicId: clinicId,
        state: state
    });
};

// 已完成任务详情页
Clinic.finishedTaskDetail = function(req, res) {
    let userData = Session.getUserData(req);
    res.render('clinic/finishedTaskDetail', {
        username: userData.username,
        userId: userData.userId
    });
};

module.exports = Clinic;
