'use strict'

const Q = require('q');
const Logger = require('../util/logger');
const Define = require('../util/define');
const clinicModel = require('../model/clinic');

let KeyDefine = new Define();

let Clinic = {};

// 可接任务列表页
Clinic.taskManage = function(req, res) {
    res.render('clinic/taskManage');
};

// 已接任务列表页
Clinic.occupiedTask = function(req, res) {
    res.render('clinic/occupiedTask');
};

// 重分析任务列表页
Clinic.reanalysisTask = function(req, res) {
    res.render('clinic/reanalysisTask');
};

// 已完成任务列表页
Clinic.finishedTask = function(req, res) {
    res.render('clinic/finishedTask');
};

// 分析任务详情页
Clinic.analysisTaskDetail = function(req, res) {
    res.render('clinic/analysisTaskDetail');
};

// 重分析任务详情页
Clinic.reanalysisTaskDetail = function(req, res) {
    res.render('clinic/reanalysisTaskDetail');
};

// 已完成任务详情页
Clinic.finishedTaskDetail = function(req, res) {
    res.render('clinic/finishedTaskDetail');
};

module.exports = Clinic;
