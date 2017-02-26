'use strict'

const Express = require('express');
const clinicControl = require('./control/clinic');

// 日志模块
const Logger = require('./util/logger');
// 枚举变量
const Define = require('./util/define');
// 验证模块
const Auth = require('./util/auth');

let KeyDefine = new Define();

let router = Express.Router();

router.get('/test', (req, res) => {
    Auth.auth(req, res, '', function() {
        res.render('test');
    });
});

// 退出登录
router.get('/logout', (req, res) => {
    res.cookie('connect.sid', '', {expires: new Date(1), path: '/' });
    res.redirect('/');
});

// 可接任务列表页
router.get('/', (req, res) => {
    Auth.auth(req, res, '', clinicControl.taskManage);
});

// 已接任务列表页
router.get('/clinic/occupiedTask', (req, res) => {
    Auth.auth(req, res, '', clinicControl.occupiedTask);
});

// 重分析任务列表页
router.get('/clinic/reanalysisTask', (req, res) => {
    Auth.auth(req, res, '', clinicControl.reanalysisTask);
});

// 重分析任务详情页
router.get('/clinic/reanalysisDetail', (req, res) => {
    Auth.auth(req, res, '', clinicControl.reanalysisTaskDetail);
});

// 已完成任务列表页
router.get('/clinic/finishedTask', (req, res) => {
    Auth.auth(req, res, '', clinicControl.finishedTask);
});

// 分析任务详情页
router.get('/clinic/analysisTaskDetail', (req, res) => {
    Auth.auth(req, res, '', clinicControl.analysisTaskDetail);
});

// 重分析任务详情页
router.get('/clinic/reanalysisTaskDetail', (req, res) => {
    Auth.auth(req, res, '', clinicControl.reanalysisTaskDetail);
});

// 已完成任务详情页
router.get('/clinic/finishedTaskDetail', (req, res) => {
    Auth.auth(req, res, '', clinicControl.finishedTaskDetail);
});

module.exports = router;
