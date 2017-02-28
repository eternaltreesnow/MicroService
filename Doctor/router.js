'use strict'

const Express = require('express');
const clinicControl = require('./control/clinic');
const teamControl = require('./control/team');

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

// 分析任务列表页
router.get('/', (req, res) => {
    Auth.auth(req, res, '', clinicControl.analysisTask);
});

// 分析任务详情页
router.get('/clinic/analysisDetail', (req, res) => {
    Auth.auth(req, res, '', clinicControl.analysisDetail);
});

// 所有任务页
router.get('/clinic/taskManage', (req, res) => {
    Auth.auth(req, res, '', clinicControl.taskManage);
});

// 待审核列表页
router.get('/clinic/censorTask', (req, res) => {
    Auth.auth(req, res, '', clinicControl.censorTask);
});

// 待审核详情页
router.get('/clinic/censorDetail', (req, res) => {
    Auth.auth(req, res, '', clinicControl.censorDetail);
});

// 团队管理页
router.get('/team/teamManage', (req, res) => {
    Auth.auth(req, res, '', teamControl.teamManage);
});

// 医生详情页
router.get('/team/memberDetail', (req, res) => {
    Auth.auth(req, res, '', teamControl.memberDetail);
});

// 技师详情页
router.get('/team/techDetail', (req, res) => {
    Auth.auth(req, res, '', teamControl.techDetail);
});

module.exports = router;
